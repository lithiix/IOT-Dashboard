'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Activity,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  FlaskConical,
  Compass,
  Droplet,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reusable Intersection Observer for scroll-reveal fade-in-up animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans relative selection:bg-emerald-500 selection:text-slate-950">

      {/* Inject custom CSS keyframes for advanced animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.2), 0 0 5px rgba(6, 182, 212, 0.1);
            border-color: rgba(16, 185, 129, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.5), 0 0 15px rgba(6, 182, 212, 0.3);
            border-color: rgba(6, 182, 212, 0.6);
          }
        }
        @keyframes ctaPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6), 0 0 15px rgba(6, 182, 212, 0.3);
            transform: scale(1.02);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 3.5s ease-in-out infinite;
        }
        .animate-cta-pulse {
          animation: ctaPulse 4s ease-in-out infinite;
        }
        .reveal-element {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-element.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Large Neon Radial Glows behind Hero & Services */}
      <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[40%] left-[5%] w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse" />

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent truncate">
              Gravity Core Cultivation
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#products" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200">Products</a>
            <a href="#services" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200">Services</a>
            <a href="#about" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200">About Tech</a>
            <a href="#contact" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200">Contact</a>
          </nav>

          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-200 shadow-md flex items-center group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-emerald-400 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col space-y-3 pb-4 border-b border-white/5">
              <a
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Products
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                About Tech
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex flex-col space-y-3 pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center justify-center"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Hydroponic Systems</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Cultivate the Future with{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Gravity-Defying Tech
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0">
              Grow premium, high-yield organic crops indoors or outdoors. Our fully automated Hydroponic Towers optimize nutrient delivery using IoT sensors and AI-driven growth telemetry.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="#products"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer animate-cta-pulse"
              >
                Get Your Tower Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-xl bg-slate-900 border border-white/10 hover:border-slate-700 text-slate-100 font-semibold hover:bg-slate-900/60 transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                View Live Telemetry
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-xs text-slate-500 mt-1">Water Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3x</div>
                <div className="text-xs text-slate-500 mt-1">Faster Growth</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-500 mt-1">Organic Yield</div>
              </div>
            </div>
          </div>

          {/* Hero Product Image (Hydroponic Tower Card exactly matching image_fc8775 layout description) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] -z-10" />

            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-4 w-full max-w-[380px] shadow-2xl relative overflow-hidden group animate-float animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />

              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600"
                alt="Sleek vertical smart indoor hydroponic tower"
                className="w-full h-[320px] object-cover rounded-2xl border border-slate-800/80 group-hover:scale-[1.01] transition-transform duration-500"
              />

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                <div className="text-xs text-slate-500">Device ID: <span className="text-emerald-400 font-mono">GCC-TWR01</span></div>
                <div className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-emerald-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  Telemetry Streaming
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features / Value Proposition Grid (Clean 3-Column Layout) */}
      <section id="about" className="py-24 bg-slate-900/30 border-y border-white/10 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 reveal-on-scroll reveal-element">
            <h2 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Our Engineering</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white">Smart Farming Hardware, Optimized by Software</p>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              We leverage vertical hydroponics and real-time environment analytics to create ideal modular ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature 1: Smart Hydroponic Towers */}
            <div
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md reveal-on-scroll reveal-element"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 animate-pulse-glow">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Smart Hydroponic Towers</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Maximize space with vertical growing pod structures. Engineered with cascading automated water flow and nutrient feeds requiring minimal manual effort.
              </p>
            </div>

            {/* Feature 2: Real-time Plant Monitoring */}
            <div
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md reveal-on-scroll reveal-element"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 animate-pulse-glow">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Real-time Plant Monitoring</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Continuous logging of water pH, electrical conductivity (EC), dissolved oxygen, temperatures, and relative humidity. Track stats from any browser.
              </p>
            </div>

            {/* Feature 3: AI Growth Recommendations */}
            <div
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md reveal-on-scroll reveal-element"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 animate-pulse-glow">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">AI Growth Recommendations</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Receive automated alerts indicating harvest readiness, nutrient formulation deficits, and critical atmospheric alterations derived from machine analysis.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Services & Maintenance Section */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-6 space-y-8 reveal-on-scroll reveal-element">
            <div className="space-y-4">
              <h2 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Worry-Free Operations</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Full-Service Maintenance & Installation</h3>
              <p className="text-slate-300 leading-relaxed text-base">
                We handle the hardware complexities. Our expert technicians set up your smart hydroponic tower infrastructure, formulate initial nutrient blends, and plug in the IoT sensors.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-base">Professional Installation</h4>
                  <p className="text-sm text-slate-400 mt-0.5">Siting, setup, water piping integration, and calibrating high-accuracy sensor metrics.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-base">Automated Scheduling</h4>
                  <p className="text-sm text-slate-400 mt-0.5">Automated cycles scheduled for periodic pump flushes, sterilization, and system recalibrations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-base">Continuous Remote Monitoring</h4>
                  <p className="text-sm text-slate-400 mt-0.5">If pH, salinity, or water temperature values deviate past safe thresholds, GCC teams are notified to support.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean 2-Card Image Layout matching reference designs (Scroll Reveal & Glassmorphism) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-on-scroll reveal-element">

            {/* Image 1 Card: Smart Monitoring Setup */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-4 hover:border-emerald-500/20 transition-all duration-300 shadow-lg animate-pulse-glow">
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600"
                alt="Green plants growing inside futuristic indoor farm"
                className="w-full h-[200px] object-cover rounded-2xl border border-white/5"
              />
              <div className="flex items-center justify-between mt-4 px-1">
                <span className="text-xs text-slate-400 font-bold">IoT Sensor Stream</span>
                <div className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1 text-emerald-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Live
                </div>
              </div>
            </div>

            {/* Image 2 Card: AI Recommendation Setup */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-4 hover:border-teal-500/20 transition-all duration-300 shadow-lg animate-pulse-glow">
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600"
                alt="Lush leafy greens inside automated urban farming facility"
                className="w-full h-[200px] object-cover rounded-2xl border border-white/5"
              />
              <div className="flex items-center justify-between mt-4 px-1">
                <span className="text-xs text-slate-400 font-bold">AI Growth Advice</span>
                <div className="flex items-center text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1 text-teal-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1 animate-pulse" />
                  Optimal
                </div>
              </div>
            </div>

            {/* Warranty and Nutrient Pod Details (Full width row) */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-emerald-500/10 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                <h5 className="text-slate-200 font-bold text-sm">2-Year Warranty</h5>
                <p className="text-xs text-slate-400 mt-1">Covers all hydroponic pumps and sensor modules.</p>
              </div>
              <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-emerald-500/10 transition-colors">
                <FlaskConical className="w-6 h-6 text-teal-400 mb-1" />
                <h5 className="text-slate-200 font-bold text-sm">GCC Nutrient Pods</h5>
                <p className="text-xs text-slate-400 mt-1">Bimonthly liquid nutrient replenishment packs.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action (CTA) Banner */}
      <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-indigo-950 border border-white/10 p-8 md:p-16 text-center space-y-8 overflow-hidden shadow-2xl reveal-on-scroll reveal-element">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight p-4">
            Ready to Accelerate Your Harvest?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Book a consultation to custom-design your hydroponic tower layout or preview our operational live tracking interface.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-cta-pulse">
              Book a Consultation
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-emerald-400 font-semibold flex items-center justify-center hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <Activity className="w-4 h-4 mr-2" />
              View Live Telemetry
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
              <Sprout className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-bold text-white text-sm">Gravity Core Cultivation</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-xs text-slate-400">
            <a href="#products" className="hover:text-emerald-400 transition-colors">Products</a>
            <a href="#services" className="hover:text-emerald-400 transition-colors">Services</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">Technology</a>
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Telemetry Dashboard</Link>
          </div>

          <div className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Gravity Core Cultivation. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
