'use client';

import React from 'react';
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
  RefreshCw
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Inject custom CSS keyframes for float & SVG plant animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes waterDrip {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -32px; }
        }
        @keyframes swaySlow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes swayMid {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-water-drip {
          animation: waterDrip 1.5s linear infinite;
        }
        .animate-sway-slow {
          animation: swaySlow 5s ease-in-out infinite;
        }
        .animate-sway-mid {
          animation: swayMid 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background radial glow filters for premium ambient depth */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              Gravity Core Cultivation
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-sm text-slate-350 hover:text-emerald-400 transition-colors duration-200">Products</a>
            <a href="#services" className="text-sm text-slate-350 hover:text-emerald-400 transition-colors duration-200">Services</a>
            <a href="#about" className="text-sm text-slate-350 hover:text-emerald-400 transition-colors duration-200">About Tech</a>
            <a href="#contact" className="text-sm text-slate-350 hover:text-emerald-400 transition-colors duration-200">Contact</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-200 shadow-md flex items-center group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
            <Link 
              href="/dashboard"
              className="relative px-5 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-sm font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 shadow-md flex items-center group cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin text-emerald-400 group-hover:text-emerald-300" />
              Live IoT Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Hydroponic Systems</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight">
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
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                Get Your Tower Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link 
                href="/dashboard"
                className="px-8 py-4 rounded-xl bg-slate-900 border border-white/5 hover:border-slate-800 text-slate-100 font-semibold hover:bg-slate-900/60 transition-all duration-200 flex items-center justify-center cursor-pointer"
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

          {/* Hero Product Image (Hydroponic Tower Card replicated precisely from image_fc8775.png) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
            
            <div className="bg-[#070e17] border border-cyan-500/30 rounded-[28px] p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] w-full max-w-[440px] relative overflow-hidden group animate-float">
              
              <div className="w-full h-[420px] rounded-2xl border border-white/5 bg-slate-950/80 flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500">
                <svg viewBox="0 0 200 400" className="w-full h-full select-none pointer-events-none">
                  <defs>
                    <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="50%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {/* Tower Main Structure */}
                  <rect x="85" y="40" width="30" height="320" rx="6" fill="url(#towerGrad)" stroke="#334155" strokeWidth="2" />
                  <rect x="75" y="350" width="50" height="15" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                  {/* Water Flow Animation Line */}
                  <line x1="100" y1="45" x2="100" y2="350" stroke="url(#waterFlow)" strokeWidth="2.5" strokeDasharray="8 8" className="animate-water-drip" />

                  {/* Hanging Pots/Leaves Level 1 */}
                  <g className="animate-sway-slow transform origin-[75px_100px]">
                    <path d="M75 100 L55 100 L60 115 L70 115 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M50 95 C45 80, 60 85, 65 100 C70 85, 80 80, 75 95 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="62" cy="100" r="2" fill="#06b6d4" className="animate-ping" />
                  </g>

                  <g className="animate-sway-mid transform origin-[125px_130px]">
                    <path d="M125 130 L145 130 L140 145 L130 145 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M140 125 C145 110, 130 115, 125 130 C120 115, 110 110, 115 125 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="135" cy="130" r="2" fill="#22c55e" className="animate-ping" />
                  </g>

                  {/* Level 2 */}
                  <g className="animate-sway-mid transform origin-[75px_190px]">
                    <path d="M75 190 L55 190 L60 205 L70 205 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M50 185 C45 170, 60 175, 65 190 C70 175, 80 170, 75 185 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="62" cy="190" r="2" fill="#22c55e" className="animate-ping" />
                  </g>

                  <g className="animate-sway-slow transform origin-[125px_220px]">
                    <path d="M125 220 L145 220 L140 235 L130 235 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M140 215 C145 200, 130 205, 125 220 C120 205, 110 200, 115 215 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="135" cy="220" r="2" fill="#06b6d4" className="animate-ping" />
                  </g>

                  {/* Level 3 */}
                  <g className="animate-sway-slow transform origin-[75px_280px]">
                    <path d="M75 280 L55 280 L60 295 L70 295 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M50 275 C45 260, 60 265, 65 280 C70 265, 80 260, 75 275 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="62" cy="280" r="2" fill="#06b6d4" className="animate-ping" />
                  </g>

                  <g className="animate-sway-mid transform origin-[125px_310px]">
                    <path d="M125 310 L145 310 L140 325 L130 325 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <path d="M140 305 C145 290, 130 295, 125 310 C120 295, 110 290, 115 305 Z" fill="#22c55e" opacity="0.9" />
                    <circle cx="135" cy="310" r="2" fill="#22c55e" className="animate-ping" />
                  </g>

                  {/* Glowing LED grow lights bars */}
                  <line x1="40" y1="50" x2="40" y2="330" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
                  <line x1="160" y1="50" x2="160" y2="330" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
                  
                  <circle cx="40" cy="50" r="3" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="40" cy="190" r="3" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="40" cy="330" r="3" fill="#06b6d4" className="animate-pulse" />
                  
                  <circle cx="160" cy="50" r="3" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="160" cy="190" r="3" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="160" cy="330" r="3" fill="#06b6d4" className="animate-pulse" />
                </svg>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-4 text-xs font-semibold">
                <div className="text-slate-500">Device ID: <span className="text-emerald-450 font-mono text-[13px] font-bold">GCC-TWR01</span></div>
                <div className="flex items-center text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg bg-emerald-500/5">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                  Telemetry Streaming
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features / Value Proposition Grid (Clean 3-Column Layout) */}
      <section id="about" className="py-24 bg-slate-900/30 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Our Engineering</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white">Smart Farming Hardware, Optimized by Software</p>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              We leverage vertical hydroponics and real-time environment analytics to create ideal modular ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Smart Hydroponic Towers */}
            <div 
              className="bg-[#070e17] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Smart Hydroponic Towers</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Maximize space with vertical growing pod structures. Engineered with cascading automated water flow and nutrient feeds requiring minimal manual effort.
              </p>
            </div>

            {/* Feature 2: Real-time Plant Monitoring */}
            <div 
              className="bg-[#070e17] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Real-time Plant Monitoring</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Continuous logging of water pH, electrical conductivity (EC), dissolved oxygen, temperatures, and relative humidity. Track stats from any browser.
              </p>
            </div>

            {/* Feature 3: AI Growth Recommendations */}
            <div 
              className="bg-[#070e17] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
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
          
          <div className="lg:col-span-6 space-y-8">
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

          {/* Clean 2-Card Image Layout matching reference designs (Precise image_fc8775 formatting) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Image 1 Card: Smart Monitoring Setup */}
            <div className="bg-[#070e17] border border-cyan-500/30 rounded-[28px] p-5 shadow-[0_0_15px_rgba(6,182,212,0.15)] group">
              <img 
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600" 
                alt="Green plants growing inside futuristic indoor farm" 
                className="w-full h-[200px] object-cover rounded-2xl border border-white/5"
              />
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-4 text-xs font-semibold">
                <div className="text-slate-500">Device ID: <span className="text-emerald-450 font-mono">GCC-MON01</span></div>
                <div className="flex items-center text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg bg-emerald-500/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  Live Stream
                </div>
              </div>
            </div>

            {/* Image 2 Card: AI Recommendation Setup */}
            <div className="bg-[#070e17] border border-cyan-500/30 rounded-[28px] p-5 shadow-[0_0_15px_rgba(6,182,212,0.15)] group">
              <img 
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600" 
                alt="Lush leafy greens inside automated urban farming facility" 
                className="w-full h-[200px] object-cover rounded-2xl border border-white/5"
              />
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-4 text-xs font-semibold">
                <div className="text-slate-500">Device ID: <span className="text-emerald-450 font-mono">GCC-AUTO01</span></div>
                <div className="flex items-center text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg bg-teal-500/5">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-teal-500" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 mr-1.5 animate-pulse" />
                  Active
                </div>
              </div>
            </div>

            {/* Warranty and Nutrient Pod Details (Full width row) */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/30 border border-white/5 rounded-xl p-5 hover:border-emerald-500/10 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                <h5 className="text-slate-200 font-bold text-sm">2-Year Warranty</h5>
                <p className="text-xs text-slate-400 mt-1">Covers all hydroponic pumps and sensor modules.</p>
              </div>
              <div className="bg-slate-900/30 border border-white/5 rounded-xl p-5 hover:border-emerald-500/10 transition-colors">
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
        <div className="relative rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-indigo-950 border border-white/5 p-8 md:p-16 text-center space-y-8 overflow-hidden shadow-2xl">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight p-4">
            Ready to Accelerate Your Harvest?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Book a consultation to custom-design your hydroponic tower layout or preview our operational live tracking interface.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Book a Consultation
            </button>
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 border border-white/5 hover:border-emerald-500/40 text-emerald-400 font-semibold flex items-center justify-center hover:scale-105 transition-all duration-200 cursor-pointer"
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
