import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Hero background ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400 blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-400 blur-[140px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={14} /> Introducing WorkSphere
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 leading-tight">
          Find Elite Talent.<br />
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            Build Smart Contracts.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          A secure, high-performance freelancer marketplace powered by smart agreements, built-in real-time chat, and frictionless payments.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto" icon={ArrowRight} iconPosition="right">
              Get Started Now
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Hire Talent
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50">
            Why Choose WorkSphere?
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Everything you need to collaborate and pay securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverable className="flex flex-col items-center text-center p-8">
            <div className="p-3 bg-primary-500/10 text-primary-600 rounded-2xl mb-5">
              <Shield size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-2">Secure Escrow Contracts</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every job begins with an automated smart agreement, keeping payments safe until project milestones are verified.
            </p>
          </Card>

          <Card hoverable className="flex flex-col items-center text-center p-8">
            <div className="p-3 bg-accent-500/10 text-accent-600 rounded-2xl mb-5">
              <Zap size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-2">Real-Time Messaging</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect immediately with web socket chats, featuring message histories, online checks, and active indicators.
            </p>
          </Card>

          <Card hoverable className="flex flex-col items-center text-center p-8">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl mb-5">
              <DollarSign size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-2">Instant Razorpay Checkouts</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Accept credit cards, UPI, and bank transfers safely using India's most trusted payments gateway integration.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">10k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">₹5Cr+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Volume Paid</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">15k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Contracts Signed</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">99.8%</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Success Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
