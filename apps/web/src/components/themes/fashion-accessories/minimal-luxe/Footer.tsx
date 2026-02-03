import { FooterProps } from '../../types';
import Link from 'next/link';

export function MinimalLuxeFooter({ storeName }: FooterProps) {
    return (
        <footer className="pt-24 pb-12 bg-[#f6f6f6] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-20">
                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="text-3xl font-black text-gray-900 tracking-tighter">
                            {storeName}.
                        </Link>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            © {new Date().getFullYear()} {storeName}.<br />
                            All Rights Reserved
                        </p>
                    </div>

                    {/* Links - About Us */}
                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest">About Us</h4>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">About us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Store location</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Orders tracking</Link></li>
                        </ul>
                    </div>

                    {/* Links - Useful Links */}
                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest">Useful Links</h4>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Support Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Size guide</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Links - Follow Us */}
                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest">Follow Us</h4>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Youtube</Link></li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div className="lg:col-span-1 space-y-6">
                        <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest">Subscribe</h4>
                        <p className="text-[13px] font-medium text-gray-500 leading-relaxed">
                            Get E-mail updates about our latest shop and special offers.
                        </p>
                        <div className="pt-4 border-b border-gray-300 pb-2 flex items-center">
                            <input
                                type="email"
                                placeholder="Enter your email address..."
                                className="bg-transparent border-none outline-none text-[12px] w-full text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <button className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-primary transition-colors mt-2">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Bottom Bar - Decorative line */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-4">
                            {/* Payment icons placeholders */}
                            <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

