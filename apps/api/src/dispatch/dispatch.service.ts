import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class DispatchService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeService,
    ) { }

    async getRadarTasks() {
        try {
            return await this.prisma.dispatchTask.findMany({
                where: {
                    dispatchProfileId: null,      // It must be unassigned
                    status: 'PENDING',            // It must be fresh/unhandled
                },
                include: {
                    order: {
                        include: {
                            store: true,             // Include store to show "Store Name"
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error('[GET_RADAR_TASKS_ERROR]', error);
            return [];
        }
    }

    async getActiveDeliveries(dispatchUserId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: dispatchUserId },
                include: { dispatchProfile: true }
            });

            if (!user?.dispatchProfile) {
                return []; // Don't throw 500, just return empty if profile is missing
            }

            return await this.prisma.dispatchTask.findMany({
                where: {
                    dispatchProfileId: user.dispatchProfile.id,
                    status: {
                        notIn: ['DELIVERED', 'CANCELLED'] // Only actively running jobs
                    }
                },
                include: {
                    rider: true,
                    order: {
                        include: { store: true }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            });
        } catch (error) {
            console.error('[GET_ACTIVE_DELIVERIES_ERROR]', error);
            return [];
        }
    }

    async getTaskById(dispatchUserId: string, taskId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: dispatchUserId },
                include: { dispatchProfile: true }
            });

            if (!user?.dispatchProfile) {
                throw new Error('Dispatch profile not found');
            }

            return await this.prisma.dispatchTask.findFirst({
                where: {
                    id: taskId,
                    dispatchProfileId: user.dispatchProfile.id
                },
                include: {
                    rider: true,
                    order: {
                        include: { store: true }
                    }
                }
            });
        } catch (error) {
            console.error('[GET_TASK_BY_ID_ERROR]', error);
            throw error;
        }
    }

    async getHistoryDeliveries(dispatchUserId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: dispatchUserId },
                include: { dispatchProfile: true }
            });

            if (!user?.dispatchProfile) {
                return [];
            }

            return await this.prisma.dispatchTask.findMany({
                where: {
                    dispatchProfileId: user.dispatchProfile.id,
                    status: {
                        in: ['DELIVERED', 'CANCELLED'] // Historical jobs
                    }
                },
                include: {
                    rider: true,
                    order: {
                        include: { store: true }
                    }
                },
                orderBy: { updatedAt: 'desc' },
                take: 100 // Cap history to prevent overwhelming payloads
            });
        } catch (error) {
            console.error('[GET_HISTORY_DELIVERIES_ERROR]', error);
            return [];
        }
    }

    async broadcastOrder(sellerUserId: string, data: { orderId: string; fee: number; pickup: string; dropoff: string }) {
        // Seller creates a task that is broadcasted to the dispatch system
        const store = await this.prisma.store.findUnique({
            where: { ownerId: sellerUserId }
        });

        if (!store) throw new UnauthorizedException('Store not found.');

        const existingTask = await this.prisma.dispatchTask.findUnique({
            where: { orderId: data.orderId }
        });

        if (existingTask) {
            throw new BadRequestException('A dispatch task for this order already exists.');
        }

        const task = await this.prisma.dispatchTask.create({
            data: {
                orderId: data.orderId,
                pickupAddress: data.pickup,
                dropoffAddress: data.dropoff,
                deliveryFee: data.fee,
                status: 'PENDING',
                paymentStatus: 'UNPAID'
            },
            include: {
                order: {
                    include: { store: true }
                }
            }
        });

        // Notify connected dispatch clients that a new task is on the radar
        this.realtime.emit('dispatch_radar_ping', {
            tenantId: task.order?.tenantId || store?.tenantId || 'DEFAULT', // Use store's tenant as fallback
            data: task
        });

        return task;
    }

    async acceptTask(dispatchUserId: string, taskId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) {
            throw new UnauthorizedException('No dispatch profile found for this account.');
        }

        const task = await this.prisma.dispatchTask.findUnique({ where: { id: taskId } });
        if (!task) throw new NotFoundException('Task not found');
        if (task.dispatchProfileId) throw new BadRequestException('Task already accepted');

        const updatedTask = await this.prisma.dispatchTask.update({
            where: { id: taskId },
            data: {
                dispatchProfileId: user.dispatchProfile.id,
                status: 'ACCEPTED'
            },
            include: { order: { include: { store: true } } }
        });

        this.realtime.emit('dispatch_status_update', {
            tenantId: updatedTask.order.tenantId,
            data: updatedTask
        });

        return updatedTask;
    }

    async updateTaskStatus(dispatchUserId: string, taskId: string, status: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) {
            throw new UnauthorizedException('No dispatch profile found');
        }

        const task = await this.prisma.dispatchTask.findUnique({ where: { id: taskId } });
        if (!task) throw new NotFoundException('Task not found');
        if (task.dispatchProfileId !== user.dispatchProfile.id) {
            throw new UnauthorizedException('You do not own this task');
        }

        const updatedTask = await this.prisma.dispatchTask.update({
            where: { id: taskId },
            data: { status },
            include: { order: { include: { store: true } } }
        });

        this.realtime.emit('dispatch_status_update', {
            tenantId: updatedTask.order.tenantId,
            data: updatedTask
        });

        // Also if DELIVERED, maybe update order status?
        if (status === 'DELIVERED') {
            await this.prisma.order.update({
                where: { id: updatedTask.orderId },
                data: { status: 'DELIVERED' }
            });
            this.realtime.emit('order_status_update', {
                tenantId: updatedTask.order.tenantId,
                orderId: updatedTask.orderId,
                status: 'DELIVERED'
            });
        }

        return updatedTask;
    }

    async getStoreActiveDeliveries(sellerUserId: string) {
        const store = await this.prisma.store.findUnique({
            where: { ownerId: sellerUserId }
        });

        if (!store) throw new UnauthorizedException('Store not found.');

        return this.prisma.dispatchTask.findMany({
            where: {
                order: { storeId: store.id }
            },
            include: {
                dispatch: {
                    include: { user: true }
                },
                order: true
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async getEarningsStats(dispatchUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) return { completedToday: 0, todayEarnings: 0, totalEarnings: 0 };

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [completedToday, allTime] = await Promise.all([
            this.prisma.dispatchTask.findMany({
                where: {
                    dispatchProfileId: user.dispatchProfile.id,
                    status: 'DELIVERED',
                    updatedAt: { gte: startOfDay }
                }
            }),
            this.prisma.dispatchTask.findMany({
                where: {
                    dispatchProfileId: user.dispatchProfile.id,
                    status: 'DELIVERED'
                }
            })
        ]);

        const todayEarnings = completedToday.reduce((acc, curr) => acc + Number(curr.deliveryFee), 0);
        const totalEarnings = allTime.reduce((acc, curr) => acc + Number(curr.deliveryFee), 0);

        return {
            completedToday: completedToday.length,
            todayEarnings,
            totalEarnings
        };
    }

    async updateProfile(userId: string, data: any) {
        if (!userId) throw new UnauthorizedException('Identification missing');

        console.log('[DISPATCH_SERVICE_DEBUG] Partial update for:', userId);

        try {
            // Check if profile exists
            let profile = await this.prisma.dispatchProfile.findUnique({
                where: { userId }
            });

            if (!profile) {
                console.warn('[DISPATCH_SERVICE_DEBUG] No profile found for user, attempting creation fallback');
                // Optional: If you want to automatically create one if missing
                profile = await this.prisma.dispatchProfile.create({
                    data: {
                        userId,
                        companyName: data.companyName || 'Hub Profile',
                        phone: data.phone || '',
                        baseRates: {},
                        vehicleTypes: ['BIKE']
                    }
                });
            }

            // Build update object
            const updateData: any = {};
            const allowedFields = [
                'companyName', 'phone', 'address', 'state', 'lga',
                'country', 'coverageAreas', 'baseRates', 'vehicleTypes',
                'isInterstate', 'utilityBill', 'cacDocument', 'cacNumber', 'logo'
            ];

            for (const field of allowedFields) {
                if (data[field] !== undefined) {
                    updateData[field] = data[field];
                }
            }

            console.log('[DISPATCH_SERVICE_DEBUG] Final Payload:', JSON.stringify(updateData));

            const result = await this.prisma.dispatchProfile.update({
                where: { id: profile.id }, // Update by PK id for safety
                data: updateData
            });

            console.log('[DISPATCH_SERVICE_DEBUG] Hub Persistent Store: SUCCESS');

            // Return only safe fields to avoid circular ref or serialization issues
            return {
                id: result.id,
                companyName: result.companyName,
                logo: result.logo,
                status: 'PERSISTED'
            };
        } catch (error: any) {
            console.error('[DISPATCH_SERVICE_DEBUG] Hub Persistence CRASH:', error.message);
            throw new InternalServerErrorException(`Persistent sync failed: ${error.message}`);
        }
    }

    // --- Rider Management ---

    async addRider(dispatchUserId: string, data: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) throw new UnauthorizedException('No dispatch profile found');

        return this.prisma.rider.create({
            data: {
                dispatchProfileId: user.dispatchProfile.id,
                staffId: data.staffId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                vehicleType: data.vehicleType,
                address: data.address,
                emergencyName: data.emergencyName,
                emergencyPhone: data.emergencyPhone,
                status: 'ACTIVE'
            }
        });
    }

    async getRiders(dispatchUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) return [];

        return this.prisma.rider.findMany({
            where: { dispatchProfileId: user.dispatchProfile.id },
            include: {
                tasks: {
                    include: { order: true },
                    orderBy: { updatedAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateRider(dispatchUserId: string, riderId: string, data: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) throw new UnauthorizedException('No dispatch profile found');

        const rider = await this.prisma.rider.findUnique({ where: { id: riderId } });
        if (!rider || rider.dispatchProfileId !== user.dispatchProfile.id) {
            throw new NotFoundException('Rider not found or unauthorized');
        }

        return this.prisma.rider.update({
            where: { id: riderId },
            data: {
                staffId: data.staffId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                vehicleType: data.vehicleType,
                address: data.address,
                emergencyName: data.emergencyName,
                emergencyPhone: data.emergencyPhone,
                status: data.status
            }
        });
    }

    async assignRider(dispatchUserId: string, taskId: string, riderId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dispatchUserId },
            include: { dispatchProfile: true }
        });

        if (!user?.dispatchProfile) throw new UnauthorizedException('No dispatch profile found');

        const task = await this.prisma.dispatchTask.findUnique({ where: { id: taskId } });
        if (!task || task.dispatchProfileId !== user.dispatchProfile.id) {
            throw new NotFoundException('Task not found or unauthorized');
        }

        const rider = await this.prisma.rider.findUnique({ where: { id: riderId } });
        if (!rider || rider.dispatchProfileId !== user.dispatchProfile.id) {
            throw new NotFoundException('Rider not found or unauthorized');
        }

        return this.prisma.dispatchTask.update({
            where: { id: taskId },
            data: { riderId },
            include: { rider: true, order: true }
        });
    }
}
