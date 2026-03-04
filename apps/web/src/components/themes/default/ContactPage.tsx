'use client';

import React from 'react';
import { PageProps } from '../types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { EditableText } from '../EditableContent';

export function DefaultContactPage({ store, isPreview, onConfigChange }: PageProps) {
    const config = store.themeConfig || {};
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <div className="bg-white min-h-screen py-20 text-left">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        <EditableText
                            value={config.contactHeroTitle || 'Contact Us'}
                            onSave={(val: string) => handleSave('contactHeroTitle', val)}
                            isPreview={isPreview}
                            label="Hero Title"
                        />
                    </h1>
                    <p className="text-gray-600">
                        <EditableText
                            value={config.contactHeroSubtitle || "Have a question or need assistance? We're here to help."}
                            onSave={(val: string) => handleSave('contactHeroSubtitle', val)}
                            isPreview={isPreview}
                            label="Hero Subtitle"
                        />
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Information */}
                    <div className="space-y-12 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-gray-900" />
                                </div>
                                <h3 className="font-bold text-gray-900">
                                    <EditableText
                                        value={config.contactEmailLabel || 'Email'}
                                        onSave={(val: string) => handleSave('contactEmailLabel', val)}
                                        isPreview={isPreview}
                                        label="Email Label"
                                    />
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    <EditableText
                                        value={store.officialEmail || config.contactEmailVal || 'support@example.com'}
                                        onSave={(val: string) => handleSave('contactEmailVal', val)}
                                        isPreview={isPreview}
                                        label="Email"
                                    />
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-gray-900" />
                                </div>
                                <h3 className="font-bold text-gray-900">
                                    <EditableText
                                        value={config.contactPhoneLabel || 'Phone'}
                                        onSave={(val: string) => handleSave('contactPhoneLabel', val)}
                                        isPreview={isPreview}
                                        label="Phone Label"
                                    />
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    <EditableText
                                        value={store.whatsappNumber || config.contactPhoneVal || '+1 234 567 890'}
                                        onSave={(val: string) => handleSave('contactPhoneVal', val)}
                                        isPreview={isPreview}
                                        label="Phone"
                                    />
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-gray-900" />
                            </div>
                            <h3 className="font-bold text-gray-900">
                                <EditableText
                                    value={config.contactAddressLabel || 'Address'}
                                    onSave={(val: string) => handleSave('contactAddressLabel', val)}
                                    isPreview={isPreview}
                                    label="Address Label"
                                />
                            </h3>
                            <div className="text-gray-600 text-sm italic">
                                <EditableText
                                    value={config.contactAddressVal || 'Visit our physical store location or reach out via our digital channels.'}
                                    onSave={(val: string) => handleSave('contactAddressVal', val)}
                                    isPreview={isPreview}
                                    label="Address Text"
                                    multiline={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 text-left">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        <EditableText
                                            value={config.contactFieldNameLabel || 'Name'}
                                            onSave={(val: string) => handleSave('contactFieldNameLabel', val)}
                                            isPreview={isPreview}
                                            label="Name Label"
                                        />
                                    </label>
                                    <input type="text" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        <EditableText
                                            value={config.contactFieldEmailLabel || 'Email'}
                                            onSave={(val: string) => handleSave('contactFieldEmailLabel', val)}
                                            isPreview={isPreview}
                                            label="Email Label"
                                        />
                                    </label>
                                    <input type="email" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    <EditableText
                                        value={config.contactFieldSubjectLabel || 'Subject'}
                                        onSave={(val: string) => handleSave('contactFieldSubjectLabel', val)}
                                        isPreview={isPreview}
                                        label="Subject Label"
                                    />
                                </label>
                                <input type="text" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    <EditableText
                                        value={config.contactFieldMessageLabel || 'Message'}
                                        onSave={(val: string) => handleSave('contactFieldMessageLabel', val)}
                                        isPreview={isPreview}
                                        label="Message Label"
                                    />
                                </label>
                                <textarea rows={4} className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:border-black transition-all resize-none"></textarea>
                            </div>
                            <button className="w-full h-12 bg-black text-white rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                                <EditableText
                                    value={config.contactSubmitButton || 'Send Message'}
                                    onSave={(val: string) => handleSave('contactSubmitButton', val)}
                                    isPreview={isPreview}
                                    label="Submit Button"
                                />
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
