'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, Sparkles, FileText, Zap, Globe, ChevronRight, Linkedin, Mail, Github, Star } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/5 rounded-full blur-[180px]" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-violet-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                GDD AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                onClick={() => router.push('/auth')}
                className="px-5 py-2.5 text-sm font-medium text-violet-300 border border-violet-500/30 rounded-xl hover:bg-violet-500/10 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            AI-Powered Game Design
            <span className="px-2 py-0.5 bg-violet-500/20 rounded-full text-xs">Beta</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
              Create Professional
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Game Design Docs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Transform your game ideas into comprehensive, professional Game Design Documents 
            in seconds using the power of AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => router.push('/auth')}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-2xl font-semibold text-lg hover:from-violet-400 hover:to-fuchsia-500 transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transform hover:scale-105"
            >
              <span>Get Started Free</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-4 text-slate-300 hover:text-white transition-colors"
            >
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-fadeIn" style={{ animationDelay: '0.35s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-sm text-slate-500">GDD Sections</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm text-slate-500">Export Formats</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-slate-500">Possibilities</div>
            </div>
          </div>

          {/* Features */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400 text-sm">Generate comprehensive GDDs in under a minute with AI assistance</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Formats</h3>
              <p className="text-slate-400 text-sm">Export your GDD as PDF, Markdown, or HTML for any workflow</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Industry Standard</h3>
              <p className="text-slate-400 text-sm">Professional templates following game industry best practices</p>
            </div>
          </div>

          {/* Testimonial / Quote */}
          <div className="mt-16 p-8 rounded-2xl bg-slate-900/30 border border-violet-500/10 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-slate-300 italic text-lg mb-4">
              "The best tool for indie developers who want professional documentation without spending hours writing."
            </p>
            <p className="text-slate-500 text-sm">— Game Developer Community</p>
          </div>
        </div>
      </main>

      {/* Footer - Always at bottom */}
      <footer className="relative z-10 border-t border-violet-500/20 bg-slate-900/80 backdrop-blur-xl mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">
                © 2025 GDD AI. All rights reserved.
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a
                href="mailto:guvendevelibau@gmail.com"
                className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">guvendevelibau@gmail.com</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/güven-develi-650054396"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>

            {/* Creator */}
            <div className="text-slate-500 text-sm">
              Made with <span className="text-red-500">♥</span> by <span className="text-violet-400 font-medium">Güven Develi</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
