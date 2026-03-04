'use client';

import React from 'react';
import { HeroProps } from '../types';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Quote } from 'lucide-react';
import { EditableText, EditableImage } from '../EditableContent';

export function VantageHero({ store, isPreview, onConfigChange }: HeroProps) {
    const config = store.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <section
            className="vantage-hero-responsive"
            style={{
                height: '100vh',
                display: 'grid',
                gridTemplateRows: '1fr auto',
                background: '#fff',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* ═══ LAYER 1: THE TITLE BLOCK ═══ */}
            <div
                className="vantage-title-block"
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 40,
                    pointerEvents: 'none',
                    padding: '0 40px'
                }}
            >
                {/* 1. Headline & Avatars Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="vantage-hero-h1"
                        style={{ fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase', textAlign: 'center', color: '#0a0a0a', margin: 0, pointerEvents: 'auto' }}
                    >
                        <EditableText
                            value={store.heroTitle || 'Elevated Essentials. Timeless Design.'}
                            onSave={(val: string) => handleSave('heroTitle', val)}
                            isPreview={isPreview}
                            label="Hero Title"
                        />
                    </motion.h1>

                    {/* 2. Avatars - Below the text */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="vantage-avatars-mobile-visible"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex' }}>
                                {[16, 17, 18].map((n, i) => (
                                    <div key={n} style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #fff', overflow: 'hidden', marginLeft: i > 0 ? -12 : 0, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                                        <img src={`https://i.pravatar.cc/80?img=${n}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                                <div style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #fff', background: store.primaryColor || '#000', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 900, marginLeft: -12 }}>
                                    <EditableText
                                        value={config.heroAvatarPlus || "+"}
                                        onSave={val => handleSave('heroAvatarPlus', val)}
                                        isPreview={isPreview}
                                        label="Avatar Plus Symbol"
                                    />
                                </div>
                            </div>
                            <span className="vantage-metric-hidden-mobile" style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af' }}>
                                <EditableText
                                    value={config.heroBadge || 'Join 2k+ Style Leaders'}
                                    onSave={(val: string) => handleSave('heroBadge', val)}
                                    isPreview={isPreview}
                                    label="Badge"
                                />
                            </span>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* ═══ LAYER 2: THE IMAGE GRID ═══ */}
            <div
                className="vantage-image-grid-system"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 12,
                    padding: '0 120px',
                    alignItems: 'end',
                    minHeight: 0,
                    overflow: 'visible',
                }}
            >
                {/* Col 1: Peak (82%) */}
                <div className="vantage-grid-column" style={{ height: '82%', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <div className="vantage-img-card" style={{ flex: 4, minHeight: 0, background: '#FF6B35', borderRadius: '48px 16px 16px 16px', overflow: 'hidden', position: 'relative' }}>
                        <EditableImage
                            src={config.heroImg1 || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"}
                            onSave={(url: string) => handleSave('heroImg1', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover"
                            label="Image 1"
                        />
                    </div>
                    <div className="vantage-img-card-small" style={{ flex: 1, minHeight: 0, background: '#F0C84A', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                        <EditableImage
                            src={config.heroImg2 || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400"}
                            onSave={(url: string) => handleSave('heroImg2', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover"
                            label="Image 2"
                        />
                    </div>
                </div>

                {/* Col 2: Mid (64%) */}
                <div className="vantage-grid-column vantage-slope-col" style={{ height: '64%', background: '#CBD8C6', borderRadius: '48px 16px 16px 16px', overflow: 'hidden', position: 'relative' }}>
                    <EditableImage
                        src={config.heroImg3 || "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600"}
                        onSave={(url: string) => handleSave('heroImg3', url)}
                        isPreview={isPreview}
                        className="w-full h-full object-cover"
                        label="Image 3"
                    />
                </div>

                {/* Col 3: Valley (46% + btn) */}
                <div className="vantage-grid-column center-valley" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                    <div className="vantage-img-card valley-card" style={{ width: '100%', flex: '0 0 46%', background: '#F0C040', borderRadius: '48px 16px 16px 16px', overflow: 'hidden', position: 'relative' }}>
                        <EditableImage
                            src={config.heroImgCentral || "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600"}
                            onSave={(url: string) => handleSave('heroImgCentral', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover"
                            label="Central Image"
                        />
                    </div>
                    <button className="vantage-cta" style={{ flexShrink: 0, background: store.primaryColor || '#000', color: '#fff', padding: '12px 26px', borderRadius: 40, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <EditableText
                            value={config.heroButtonText || 'Explore Collections'}
                            onSave={(val: string) => handleSave('heroButtonText', val)}
                            isPreview={isPreview}
                            label="Button Text"
                        />
                        <ArrowRight size={12} style={{ transform: 'rotate(-45deg)' }} />
                    </button>
                </div>

                {/* Col 4: Mid (64%) */}
                <div className="vantage-grid-column vantage-slope-col" style={{ height: '64%', background: '#A8CED8', borderRadius: '48px 16px 16px 16px', overflow: 'hidden', position: 'relative' }}>
                    <EditableImage
                        src={config.heroImg4 || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600"}
                        onSave={(url: string) => handleSave('heroImg4', url)}
                        isPreview={isPreview}
                        className="w-full h-full object-cover"
                        label="Image 4"
                    />
                </div>

                {/* Col 5: Peak (82%) */}
                <div className="vantage-grid-column" style={{ height: '82%', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <div className="vantage-img-card" style={{ flex: 4, minHeight: 0, background: '#BDD9B0', borderRadius: '48px 16px 16px 16px', overflow: 'hidden', position: 'relative' }}>
                        <EditableImage
                            src={config.heroImg5 || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"}
                            onSave={(url: string) => handleSave('heroImg5', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover"
                            label="Image 5"
                        />
                    </div>
                    <div className="vantage-img-card-small" style={{ flex: 1, minHeight: 0, background: '#2D6A4F', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                        <EditableImage
                            src={config.heroImg6 || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400"}
                            onSave={(url: string) => handleSave('heroImg6', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover"
                            label="Image 6"
                        />
                    </div>
                </div>
            </div>

            {/* ═══ LAYER 3: FOOTER BAR ═══ */}
            <div className="vantage-hero-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 120px', gap: 32, flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 320 }}>
                    <Quote size={18} color="#e5e7eb" />
                    <p style={{ color: '#9ca3af', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.5, margin: 0 }}>
                        <EditableText
                            value={config.heroQuote || '"DEFINING THE NEW STANDARD IN CONTEMPORARY APPAREL THROUGH ARCHITECTURAL LINES AND PREMIUM CRAFTSMANSHIP."'}
                            onSave={(val: string) => handleSave('heroQuote', val)}
                            isPreview={isPreview}
                            multiline
                            label="Quote"
                        />
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0a0a0a', lineHeight: 1 }}>
                            <EditableText
                                value={config.heroQuoteAuthor || 'THE SAMSTAR VISION'}
                                onSave={(val: string) => handleSave('heroQuoteAuthor', val)}
                                isPreview={isPreview}
                                label="Quote Author"
                            />
                        </span>
                        <div style={{ height: 2, width: 26, background: store.primaryColor || '#facc15', borderRadius: 2 }} />
                    </div>
                </div>

                <div className="vantage-metric-hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6 }}>
                            <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#0a0a0a' }}>
                                <EditableText
                                    value={config.metricValue || '01'}
                                    onSave={(val: string) => handleSave('metricValue', val)}
                                    isPreview={isPreview}
                                    label="Metric Value"
                                />
                            </span>
                            <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>
                                <EditableText
                                    value={config.metricLabel || 'Lifestyle'}
                                    onSave={(val: string) => handleSave('metricLabel', val)}
                                    isPreview={isPreview}
                                    label="Metric Label"
                                />
                            </span>
                        </div>
                        <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#0a0a0a', margin: '3px 0 0', lineHeight: 1.3 }}>
                            <EditableText
                                value={config.metricDesc || 'Set Up Your Fashion With The Latest Trends'}
                                onSave={(val: string) => handleSave('metricDesc', val)}
                                isPreview={isPreview}
                                multiline
                                label="Metric Description"
                            />
                        </p>
                    </div>
                    <button style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <ArrowRight size={13} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes vhSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                .vantage-hero-h1 { font-size: clamp(26px, 3.2vw, 48px); }

                @media (max-width: 768px) {
                    .vantage-hero-responsive {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100vh !important;
                        height: 100dvh !important;
                        padding-top: 0 !important;
                        padding-bottom: 60px !important; 
                        overflow: hidden !important;
                    }
 
                    .vantage-title-block {
                        position: static !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        padding: 72px 16px 2px !important;
                        gap: 0px !important;
                        flex-shrink: 0;
                    }

                    .vantage-hero-h1 {
                        font-size: 38px !important;
                        line-height: 0.9 !important;
                        margin: 0 !important;
                        text-align: center !important;
                        letter-spacing: -0.05em !important;
                        font-style: italic !important;
                        padding: 0 12px !important;
                        overflow: visible !important;
                        background: linear-gradient(135deg, #0a0a0a 0%, #444 100%) !important;
                        -webkit-background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                        background-clip: text !important;
                        display: block !important;
                        width: 100% !important;
                    }

                    .vantage-badge-hidden-mobile,
                    .vantage-avatars-hidden-mobile,
                    .vantage-metric-hidden-mobile {
                        display: none !important;
                    }

                    .vantage-image-grid-system {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr) !important;
                        flex: 1 !important;
                        min-height: 0 !important;
                        padding: 0 10px !important;
                        gap: 8px !important;
                        align-items: end !important;
                        overflow: visible !important;
                    }

                    .vantage-slope-col { display: none !important; }

                    .vantage-grid-column { height: 92% !important; }
                    .center-valley      { height: 100% !important; }
                    .valley-card        { flex: 0 0 85% !important; }

                    .vantage-hero-footer {
                        padding: 10px 16px 8px !important;
                        flex-shrink: 0;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 2px !important;
                    }
                    .vantage-hero-footer p {
                        color: #0c0c0c !important;
                        font-weight: 500 !important;
                        font-size: 10px !important;
                        line-height: 1.3 !important;
                        -webkit-text-fill-color: #0c0c0c !important;
                        margin-bottom: 2px !important;
                    }
                    .vantage-hero-footer span {
                        font-size: 15px !important;
                        font-weight: 800 !important;
                        color: #000 !important;
                    }
                }

                @media (min-width: 769px) {
                    .vantage-image-grid-system { min-height: 0; }
                }
            `}</style>
        </section>
    );
}
