'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { EditableText, EditableImage } from '../EditableContent';
import { Mail, MapPin, Phone, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';

export const DefaultAboutPage: React.FC<PageProps> = ({ store, isPreview, onConfigChange }) => {
    const config = store.themeConfig || {};
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Minimal Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 opacity-40">
                    <EditableImage
                        src={config.aboutHeroImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000'}
                        onSave={(val) => handleSave('aboutHeroImage', val)}
                        isPreview={isPreview}
                        className="w-full h-full object-cover"
                        label="Hero Background"
                    />
                </div>
                <div className="relative z-10 text-center space-y-8 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-block"
                    >
                        <div className="w-16 h-[2px] bg-white mx-auto mb-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                            <EditableText
                                value={config.aboutHeroBadge || 'The Brand Story'}
                                onSave={(val: string) => handleSave('aboutHeroBadge', val)}
                                isPreview={isPreview}
                                label="Hero Badge"
                            />
                        </span>
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">
                        <EditableText
                            value={config.aboutHeroTitle || 'Behind the Craft'}
                            onSave={(val: string) => handleSave('aboutHeroTitle', val)}
                            isPreview={isPreview}
                            label="Hero Title"
                        />
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 md:py-40 text-left">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start"
                    >
                        {/* Story Text */}
                        <motion.div variants={itemVariants} className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-[12px] font-black text-black uppercase tracking-[0.4em]">
                                    <EditableText
                                        value={config.aboutPhilBadge || 'Our Philosophy'}
                                        onSave={(val: string) => handleSave('aboutPhilBadge', val)}
                                        isPreview={isPreview}
                                        label="Philosophy Badge"
                                    />
                                </h2>
                                <h3 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-[0.9]">
                                    <EditableText
                                        value={config.aboutPhilTitle || 'Driven by \n Excellence.'}
                                        onSave={(val: string) => handleSave('aboutPhilTitle', val)}
                                        isPreview={isPreview}
                                        label="Philosophy Title"
                                        multiline={true}
                                    />
                                </h3>
                            </div>

                            <div className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed space-y-8">
                                <EditableText
                                    value={config.about_story || "We believe that every product tells a story. Our journey began with a simple passion for quality and design, and it has evolved into a pursuit of perfection. Every piece in our collection is curated with the utmost care, ensuring that it meets our rigorous standards for style and durability."}
                                    onSave={(val) => handleSave('about_story', val)}
                                    isPreview={isPreview}
                                    multiline={true}
                                    label="Our Story Content"
                                />
                            </div>

                            <div className="pt-8">
                                <button className="group flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] hover:text-gray-500 transition-colors">
                                    <EditableText
                                        value={config.aboutPhilButton || 'Explore Collections'}
                                        onSave={(val: string) => handleSave('aboutPhilButton', val)}
                                        isPreview={isPreview}
                                        label="Button Text"
                                    />
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Story Image Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 pt-12">
                            <div className="space-y-6 text-left">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100">
                                    <EditableImage
                                        src={config.about_image_1 || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1000'}
                                        onSave={(val) => handleSave('about_image_1', val)}
                                        isPreview={isPreview}
                                        className="w-full h-full object-cover"
                                        label="Gallery Image 1"
                                    />
                                </div>
                                <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100">
                                    <EditableImage
                                        src={config.about_image_2 || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1000'}
                                        onSave={(val) => handleSave('about_image_2', val)}
                                        isPreview={isPreview}
                                        className="w-full h-full object-cover"
                                        label="Gallery Image 2"
                                    />
                                </div>
                            </div>
                            <div className="pt-12 space-y-6 text-left">
                                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100">
                                    <EditableImage
                                        src={config.about_image_3 || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000'}
                                        onSave={(val) => handleSave('about_image_3', val)}
                                        isPreview={isPreview}
                                        className="w-full h-full object-cover"
                                        label="Gallery Image 3"
                                    />
                                </div>
                                <div className="p-10 rounded-[2rem] bg-black text-white flex flex-col justify-between aspect-square">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">
                                        <EditableText
                                            value={config.aboutEstLabel || 'Established'}
                                            onSave={(val: string) => handleSave('aboutEstLabel', val)}
                                            isPreview={isPreview}
                                            label="Established Label"
                                        />
                                    </h4>
                                    <span className="text-4xl font-black italic tracking-tighter uppercase italic">
                                        <EditableText
                                            value={config.aboutEstVal || 'MMXXIV'}
                                            onSave={(val: string) => handleSave('aboutEstVal', val)}
                                            isPreview={isPreview}
                                            label="Established Year"
                                        />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact / Footer Info */}
            <section className="py-24 bg-gray-50 text-left">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                <EditableText
                                    value={config.aboutLocLabel || 'Location'}
                                    onSave={(val: string) => handleSave('aboutLocLabel', val)}
                                    isPreview={isPreview}
                                    label="Location Label"
                                />
                            </h4>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-black mt-1" />
                                <div className="text-sm font-bold text-gray-900 leading-relaxed uppercase tracking-wider">
                                    <EditableText
                                        value={config.aboutLocVal || 'Available Worldwide'}
                                        onSave={(val: string) => handleSave('aboutLocVal', val)}
                                        isPreview={isPreview}
                                        label="Location Detail"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                <EditableText
                                    value={config.aboutInqLabel || 'Inquiries'}
                                    onSave={(val: string) => handleSave('aboutInqLabel', val)}
                                    isPreview={isPreview}
                                    label="Inquiries Label"
                                />
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-black" />
                                    <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <EditableText
                                            value={store.officialEmail || config.aboutInqEmail || 'support@opnmrt.com'}
                                            onSave={(val: string) => handleSave('aboutInqEmail', val)}
                                            isPreview={isPreview}
                                            label="Email"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="w-5 h-5 text-black" />
                                    <div className="text-sm font-bold text-gray-900 tracking-wider">
                                        <EditableText
                                            value={config.aboutInqSupport || 'SUPPORT 24/7'}
                                            onSave={(val: string) => handleSave('aboutInqSupport', val)}
                                            isPreview={isPreview}
                                            label="Support Text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                <EditableText
                                    value={config.aboutConnLabel || 'Connect'}
                                    onSave={(val: string) => handleSave('aboutConnLabel', val)}
                                    isPreview={isPreview}
                                    label="Connect Label"
                                />
                            </h4>
                            <div className="flex gap-6">
                                <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-black">
                                    <Instagram className="w-5 h-5" />
                                </button>
                                <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-black">
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-black">
                                    <Facebook className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
