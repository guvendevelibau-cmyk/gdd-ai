'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, Gift } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const FREE_CREDITS = 1;

// Initialize user in Firestore with free credits
async function initializeUserInFirestore(userId: string, email: string, displayName?: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        displayName: displayName || '',
        credits: FREE_CREDITS,
        createdAt: new Date().toISOString(),
        totalCreditsUsed: 0,
        totalCreditsPurchased: 0,
      });
      console.log(`User ${userId} initialized with ${FREE_CREDITS} free credits`);
    }
  } catch (error) {
    console.error('Error initializing user:', error);
  }
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/generator');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const getErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered.';
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      case 'auth/popup-closed-by-user': return 'Sign-in popup was closed.';
      default: return 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required.');
      }

      if (!isLogin && !formData.name) {
        throw new Error('Name is required.');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        await initializeUserInFirestore(userCredential.user.uid, formData.email, userCredential.user.displayName || '');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });
        await initializeUserInFirestore(userCredential.user.uid, formData.email, formData.name);
      }
      
      router.push('/generator');
      
    } catch (err: any) {
      console.error('Auth error:', err);
      const message = err.code ? getErrorMessage(err.code) : err.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUserInFirestore(result.user.uid, result.user.email || '', result.user.displayName || '');
      router.push('/generator');
    } catch (err: any) {
      console.error('Google auth error:', err);
      const message = err.code ? getErrorMessage(err.code) : 'Failed to sign in with Google.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <button onClick={() => router.push('/')} className="fixed top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" /><span>Home</span>
      </button>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-violet-500/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">GDD AI</h1>
              <p className="text-slate-400 text-sm mt-2">{isLogin ? 'Welcome back!' : 'Create your free account'}</p>
            </div>

            {!isLogin && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                <Gift className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-medium text-sm">🎉 Get 2 Free Credits!</p>
                  <p className="text-emerald-400/70 text-xs">Create your first GDDs for free</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white text-slate-800 rounded-xl font-medium hover:bg-slate-100 transition-all disabled:opacity-60 mb-6">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-900 text-slate-500">or</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" placeholder="John Doe" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-400 hover:to-fuchsia-500 transition-all disabled:opacity-60 shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-violet-400 hover:text-violet-300 ml-2 font-medium">{isLogin ? 'Sign Up' : 'Sign In'}</button>
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-violet-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <span>Made with</span><span className="text-red-500">♥</span><span>by</span><span className="text-violet-400 font-medium">Güven Develi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
