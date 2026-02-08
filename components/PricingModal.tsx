'use client';

import React from 'react';
import { X, Coins, Zap, Crown, Check, Sparkles, ExternalLink } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  userId: string;
  userEmail: string;
}

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 5,
    icon: Zap,
    popular: false,
    // Direkt checkout linki - userId'yi parametre olarak ekliyoruz
    checkoutUrl: 'https://aigdd.lemonsqueezy.com/checkout/buy/0887f6bd-9f00-46ea-a3e6-c717ca731de2',
    features: ['10 GDD generations', 'All export formats', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 50,
    price: 20,
    icon: Crown,
    popular: true,
    // Direkt checkout linki
    checkoutUrl: 'https://aigdd.lemonsqueezy.com/checkout/buy/8848a565-d48f-4a53-a123-12d4636bd3b5',
    features: ['50 GDD generations', 'All export formats', 'Priority support', 'Best value!'],
  },
];

export default function PricingModal({ isOpen, onClose, currentCredits, userId, userEmail }: PricingModalProps) {
  if (!isOpen) return null;

  const handlePurchase = (checkoutUrl: string) => {
    // userId ve email'i URL parametresi olarak ekle (webhook'ta kullanılacak)
    const url = new URL(checkoutUrl);
    url.searchParams.set('checkout[custom][user_id]', userId);
    if (userEmail) {
      url.searchParams.set('checkout[email]', userEmail);
    }
    
    // Yeni sekmede aç
    window.open(url.toString(), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl border border-violet-500/30 overflow-hidden shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="relative p-6 border-b border-violet-500/20 bg-slate-900/80">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Get More Credits</h2>
            <p className="text-slate-400 text-sm">
              You have <span className="text-violet-400 font-semibold">{currentCredits} credits</span> remaining
            </p>
          </div>
        </div>

        {/* Packages */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              
              return (
                <div
                  key={pkg.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    pkg.popular
                      ? 'bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border-fuchsia-500/50'
                      : 'bg-slate-800/50 border-violet-500/20 hover:border-violet-500/40'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> BEST VALUE
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pkg.popular ? 'bg-fuchsia-500/30' : 'bg-violet-500/20'}`}>
                      <Icon className={`w-6 h-6 ${pkg.popular ? 'text-fuchsia-400' : 'text-violet-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{pkg.name}</h3>
                      <p className={`text-2xl font-bold ${pkg.popular ? 'text-fuchsia-400' : 'text-violet-400'}`}>
                        {pkg.credits} <span className="text-sm font-normal text-slate-400">credits</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">${pkg.price}</span>
                    <span className="text-slate-400 text-sm ml-1">one-time</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className={`w-4 h-4 ${pkg.popular ? 'text-fuchsia-400' : 'text-violet-400'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(pkg.checkoutUrl)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:from-fuchsia-400 hover:to-violet-400 shadow-lg shadow-fuchsia-500/30'
                        : 'bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" /> Purchase
                  </button>

                  <p className="text-center text-xs text-slate-500 mt-3">
                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              🔒 Secure payment via Lemon Squeezy. Credits never expire.
            </p>
            <p className="text-slate-600 text-xs mt-2">
              After payment, return to this page and refresh to see your credits.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
