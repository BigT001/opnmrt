import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl font-mono">O</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">OPNMRT</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-emerald-200 font-bold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span className="block text-sm font-bold uppercase tracking-[0.2em] text-primary sm:text-base lg:text-sm xl:text-base mb-2">
                    Coming Soon: OPNMRT v1.0
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-slate-900">Build your AI-powered</span>
                    <span className="block text-primary">Storefront in minutes</span>
                  </span>
                </h1>
                <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-lg lg:text-lg xl:text-xl leading-relaxed">
                  OPNMRT is the world&apos;s first multi-tenant commerce engine with built-in AI insights. Own your brand, own your customers, and let AI handle the heavy lifting.
                </p>
                <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <Link href="/register" className="inline-flex items-center px-10 py-5 border border-transparent text-lg font-bold rounded-2xl text-white bg-primary hover:brightness-110 shadow-2xl shadow-emerald-200 transition-all hover:-translate-y-1">
                    Create Your Store Now
                  </Link>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-3xl shadow-3xl overflow-hidden ring-1 ring-slate-900/10 bg-slate-900 aspect-video flex items-center justify-center p-1">
                  <div className="bg-slate-800 w-full h-full rounded-2xl flex flex-col items-center justify-center text-primary font-bold text-center">
                    <p className="text-5xl mb-4">🚀</p>
                    <p className="text-xl tracking-tight">AI Seller Dashboard</p>
                    <p className="text-sm font-medium text-slate-400 mt-2">Coming soon to your browser</p>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="bg-slate-50 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-bold text-primary tracking-[0.3em] uppercase">Infrastructure</h2>
              <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Everything you need to grow
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  title="Multi-Tenancy"
                  description="Each store gets its own isolated environment, custom domain support, and dedicated buyer accounts."
                />
                <FeatureCard
                  title="AI Assistant"
                  description="Product descriptions, inventory alerts, and sales insights powered by state-of-the-art Gemini LLMs."
                />
                <FeatureCard
                  title="Direct Payments"
                  description="Connect your Paystack account and receive funds directly from your buyers. We take 0% commission."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2026 OPNMRT SaaS Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
