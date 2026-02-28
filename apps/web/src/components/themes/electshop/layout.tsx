'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, usePathname } from 'next/navigation';
import { ElectshopNavbar } from './Navbar';
import { ElectshopFooter } from './Footer';
import { ElectshopCartDrawer } from './CartDrawer';
import { ElectshopWishlistDrawer } from './WishlistDrawer';
import { ElectshopChatDrawer } from './ChatDrawer';
import { useChatStore } from '@/store/useChatStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ShoppingBag, Heart, MessageCircle, Package } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export function ElectshopLayout({ store, children, isPreview, onConfigChange, onNavigate, virtualPath }: StoreThemeProps) {
    const pathname = usePathname();
    const params = useParams<{ subdomain: string }>();
    const subdomain = store?.subdomain || params?.subdomain;
    const { user } = useAuthStore();
    const { toggleDrawer: toggleChat, unreadCount } = useChatStore();
    const { toggleDrawer: toggleWishlist, items: wishlistItems } = useWishlistStore();

    const isActive = (path: string) => {
        const fullPath = `/store/${subdomain}${path ? '/' + path : ''}`;
        return pathname === fullPath;
    };

    const navItems = [
        { icon: Home, label: 'Home', path: '' },
        { icon: Heart, label: 'Favorites', isWishlist: true, count: wishlistItems.length },
        { icon: ShoppingBag, label: 'Shop', path: 'shop', isCentral: true },
        { icon: MessageCircle, label: 'Chat', isChat: true, count: unreadCount },
        { icon: Package, label: 'Orders', path: 'customer/orders' },
    ];

    const config = store.themeConfig || {};
    const primaryColor = store.primaryColor || config.primaryColor || '#2874f0';
    const primaryFont = config.primaryFont || 'font-sans';

    return (
        <div className={`theme-electshop-holder min-h-screen bg-[#f1f3f6] ${primaryFont} text-[#212121] pb-20 lg:pb-0`}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --elect-primary: ${primaryColor};
                    --elect-font: ${primaryFont === 'font-serif' ? "'Crimson Pro', serif" : primaryFont === 'font-mono' ? "'JetBrains Mono', monospace" : "'Plus Jakarta Sans', sans-serif"};
                }

                .theme-electshop-holder,
                .theme-electshop-holder * {
                    font-family: var(--elect-font), sans-serif !important;
                }

                /* Primary Color Force Overrides */
                .theme-electshop-holder .text-brand,
                .theme-electshop-holder .text-\[\#2874f0\],
                .theme-electshop-holder .group-hover\:text-\[\#2874f0\]:hover { 
                    color: var(--elect-primary) !important; 
                }

                .theme-electshop-holder .bg-brand,
                .theme-electshop-holder .bg-\[\#2874f0\],
                .theme-electshop-holder .hover\:bg-\[\#2874f0\]:hover { 
                    background-color: var(--elect-primary) !important; 
                }

                /* Dynamic Opacity Helpers */
                .theme-electshop-holder .bg-brand\/5 { background-color: color-mix(in srgb, var(--elect-primary), transparent 95%) !important; }
                .theme-electshop-holder .bg-brand\/10 { background-color: color-mix(in srgb, var(--elect-primary), transparent 90%) !important; }
                .theme-electshop-holder .bg-brand\/20 { background-color: color-mix(in srgb, var(--elect-primary), transparent 80%) !important; }
                .theme-electshop-holder .border-brand\/10 { border-color: color-mix(in srgb, var(--elect-primary), transparent 90%) !important; }
                .theme-electshop-holder .border-brand\/20 { border-color: color-mix(in srgb, var(--elect-primary), transparent 80%) !important; }

                .theme-electshop-holder .bg-\[\#1a5fbb\],
                .theme-electshop-holder .hover\:bg-\[\#1a5fbb\]:hover { 
                    background-color: var(--elect-primary) !important;
                    filter: brightness(0.9);
                }

                .theme-electshop-holder .border-brand,
                .theme-electshop-holder .border-\[\#2874f0\],
                .theme-electshop-holder .focus-within\:border-\[\#2874f0\]:focus-within { 
                    border-color: var(--elect-primary) !important; 
                }

                .theme-electshop-holder .fill-brand,
                .theme-electshop-holder .fill-\[\#2874f0\] { 
                    fill: var(--elect-primary) !important; 
                }

                /* Scrollbar Customization */
                .theme-electshop-holder::-webkit-scrollbar { width: 6px; }
                .theme-electshop-holder::-webkit-scrollbar-thumb {
                    background: var(--elect-primary);
                    border-radius: 10px;
                }
            `}</style>

            <ElectshopNavbar
                storeName={store.name}
                logo={store.logo}
                subdomain={store.subdomain}
                storeId={store.id}
                isPreview={isPreview}
                primaryColor={primaryColor}
                themeConfig={store.themeConfig}
            />

            <main className="pt-0">
                {children}
            </main>

            {!pathname?.includes('/customer') && !pathname?.includes('/dashboard') && (
                <ElectshopFooter
                    storeName={store.name}
                    subdomain={store.subdomain}
                    isPreview={isPreview}
                    primaryColor={primaryColor}
                    themeConfig={store.themeConfig}
                    instagram={store.instagram}
                    twitter={store.twitter}
                    facebook={store.facebook}
                    tiktok={store.tiktok}
                />
            )}

            {/* Mobile Bottom Navigation */}
            {!pathname?.includes('/customer') && !pathname?.includes('/dashboard') && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-2 py-3 pb-8 md:hidden flex items-end justify-around z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                >
                    {navItems.map((item, idx) => {
                        const active = isActive(item.path || '___none___');

                        const content = (
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center gap-1 group relative transition-all"
                            >
                                {item.isCentral ? (
                                    <div className="absolute -top-16 flex flex-col items-center">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl ring-4 ring-white transition-all transform hover:scale-110 shadow-brand/40 bg-brand ${active ? 'brightness-90' : ''}`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${active ? 'text-brand' : 'text-gray-400'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`transition-colors relative ${active ? 'text-brand' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                            <item.icon className={`w-6 h-6 ${active ? 'fill-brand/10' : ''}`} />
                                            {item.count !== undefined && item.count > 0 && (
                                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                                                    {item.count > 9 ? '9+' : item.count}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${active ? 'text-brand' : 'text-gray-400'}`}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </motion.div>
                        );

                        const baseClass = "outline-none w-1/5 flex flex-col items-center justify-center";

                        if (item.isChat) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (!user) {
                                            toast.error('Please login to start a live chat');
                                            return;
                                        }
                                        toggleChat();
                                    }}
                                    className={baseClass}
                                >
                                    {content}
                                </button>
                            );
                        }

                        if (item.isWishlist) {
                            return (
                                <button
                                    key={idx}
                                    onClick={toggleWishlist}
                                    className={baseClass}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={isPreview ? '#' : `/store/${subdomain}/${item.path}`}
                                onClick={(e) => {
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        onNavigate(item.path || 'index');
                                    }
                                }}
                                className={baseClass}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </motion.div>
            )}

            <ElectshopCartDrawer storeId={store.id} />
            <ElectshopWishlistDrawer storeId={store.id} />
            <ElectshopChatDrawer />
            <Toaster position="bottom-center" />
        </div>
    );
}
