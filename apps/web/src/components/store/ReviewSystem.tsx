'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Loader2, Share2, Facebook, Twitter, Link2 } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        image: string;
    };
}

interface ReviewSystemProps {
    productId: string;
    productName: string;
}

export function ReviewSystem({ productId, productName }: ReviewSystemProps) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchReviews = async () => {
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                api.get(`/reviews/product/${productId}`),
                api.get(`/reviews/rating/${productId}`)
            ]);
            setReviews(reviewsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to leave a review');
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/reviews/${productId}`, { rating, comment });
            setRating(5);
            setComment('');
            setShowForm(false);
            await fetchReviews();
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const shareOnWhatsApp = () => {
        const text = `Check out ${productName} on OPNMRT: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="mt-16 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-5 h-5 ${s <= stats.averageRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-slate-600">{stats.averageRating.toFixed(1)} / 5.0</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stats.totalReviews} Reviews</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={shareOnWhatsApp}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Share via WhatsApp
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-slate-900/20"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Write a Review
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">How would you rate it?</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your experience (optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others what you think about this product..."
                                    className="w-full h-32 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-10 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full h-40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center gap-4">
                        <Star className="w-8 h-8 text-slate-200" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Be the first to review this product</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                                        {review.user.image ? (
                                            <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-black text-slate-400">{review.user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{review.user.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                "{review.comment || 'No comment provided'}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
