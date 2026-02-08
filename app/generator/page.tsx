'use client';

export const dynamic = "force-dynamic";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gamepad2, ChevronRight, ChevronLeft, Sparkles, Plus, Trash2, Check, Loader2, Target, Swords, BookOpen, Users, Map, Palette, Music, Cpu, Coins, Megaphone, AlertCircle, X, Download, Copy, FileText, CheckCircle, Linkedin, Mail, LogOut, User } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import PricingModal from '@/components/PricingModal';

interface Character { name: string; role: string; description: string; abilities: string; }
interface GDDFormData { gameName: string; tagline: string; genre: string; platform: string[]; targetAudience: string; esrbRating: string; uniqueSellingPoints: string; coreMechanics: string; controlScheme: string; gameLoops: string; progressionSystem: string; difficultySettings: string; multiplayerFeatures: string; storyPremise: string; worldSetting: string; mainConflict: string; narrativeStyle: string; characters: Character[]; levelCount: string; levelDesignPhilosophy: string; environmentTypes: string; artStyle: string; colorPalette: string; uiStyle: string; visualReferences: string; musicStyle: string; soundDesign: string; voiceActing: string; engine: string; minSpecs: string; targetFPS: string; saveSystem: string; businessModel: string; pricingStrategy: string; dlcPlans: string; targetLaunchDate: string; marketingChannels: string; competitorAnalysis: string; }
interface GDDResponse { gddText: string; mermaidChartCode: string; mathTableHTML: string; }

const PLATFORMS = ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch', 'Mobile iOS', 'Mobile Android', 'Web'];
const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Puzzle', 'Horror', 'Platformer', 'Shooter', 'Survival', 'Roguelike'];
const ENGINES = ['Unity', 'Unreal Engine 5', 'Godot', 'GameMaker', 'Custom'];
const BUSINESS_MODELS = ['Premium $60', 'Premium $40', 'Premium $20', 'Free-to-Play', 'Subscription'];
const SECTIONS = [
  { id: 'overview', title: 'Overview', icon: Target }, { id: 'gameplay', title: 'Gameplay', icon: Swords },
  { id: 'story', title: 'Story', icon: BookOpen }, { id: 'characters', title: 'Characters', icon: Users },
  { id: 'levels', title: 'Levels', icon: Map }, { id: 'art', title: 'Art Style', icon: Palette },
  { id: 'audio', title: 'Audio', icon: Music }, { id: 'technical', title: 'Technical', icon: Cpu },
  { id: 'monetization', title: 'Business', icon: Coins }, { id: 'marketing', title: 'Marketing', icon: Megaphone },
];

// SearchParams'ı ayrı component'te kullan
function PurchaseSuccessHandler({ onSuccess }: { onSuccess: () => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('purchase') === 'success') {
      onSuccess();
      window.history.replaceState({}, '', '/generator');
    }
  }, [searchParams, onSuccess]);
  
  return null;
}

function GDDGeneratorContent() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<GDDResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'gdd' | 'flowchart' | 'tables'>('gdd');
  const [showPricing, setShowPricing] = useState(false);

  const fetchCredits = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setCredits(userSnap.data().credits || 0);
    } catch (e) { console.error('Credits error:', e); }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { setUser(u); await fetchCredits(u.uid); setAuthLoading(false); }
      else router.push('/auth');
    });
    return () => unsub();
  }, [router]);

  const handlePurchaseSuccess = () => {
    setSuccessMessage('🎉 Purchase successful! Your credits have been added.');
    if (user) fetchCredits(user.uid);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleLogout = async () => { await signOut(auth); router.push('/'); };

  const [formData, setFormData] = useState<GDDFormData>({
    gameName: '', tagline: '', genre: '', platform: [], targetAudience: '', esrbRating: '', uniqueSellingPoints: '',
    coreMechanics: '', controlScheme: '', gameLoops: '', progressionSystem: '', difficultySettings: '', multiplayerFeatures: '',
    storyPremise: '', worldSetting: '', mainConflict: '', narrativeStyle: '', characters: [{ name: '', role: '', description: '', abilities: '' }],
    levelCount: '', levelDesignPhilosophy: '', environmentTypes: '', artStyle: '', colorPalette: '', uiStyle: '', visualReferences: '',
    musicStyle: '', soundDesign: '', voiceActing: '', engine: '', minSpecs: '', targetFPS: '', saveSystem: '',
    businessModel: '', pricingStrategy: '', dlcPlans: '', targetLaunchDate: '', marketingChannels: '', competitorAnalysis: '',
  });

  const updateField = (f: keyof GDDFormData, v: any) => setFormData(p => ({ ...p, [f]: v }));
  const togglePlatform = (p: string) => updateField('platform', formData.platform.includes(p) ? formData.platform.filter(x => x !== p) : [...formData.platform, p]);
  const addChar = () => updateField('characters', [...formData.characters, { name: '', role: '', description: '', abilities: '' }]);
  const updateChar = (i: number, f: keyof Character, v: string) => updateField('characters', formData.characters.map((c, idx) => idx === i ? { ...c, [f]: v } : c));
  const removeChar = (i: number) => { if (formData.characters.length > 1) updateField('characters', formData.characters.filter((_, idx) => idx !== i)); };

  const deductCredit = async () => {
    if (!user) return false;
    try {
      await updateDoc(doc(db, 'users', user.uid), { credits: increment(-1), totalCreditsUsed: increment(1), lastUsedAt: new Date().toISOString() });
      setCredits(p => p - 1);
      return true;
    } catch (e) { return false; }
  };

  const handleGenerate = async () => {
    if (!formData.gameName || !formData.genre) { setError('Game name and genre required!'); return; }
    if (credits < 1) { setError('No credits! Purchase more to continue.'); setShowPricing(true); return; }
    setIsLoading(true); setError(null); setProgress(0);
    const iv = setInterval(() => setProgress(p => p >= 90 ? p : p + Math.random() * 10), 500);
    try {
      const res = await fetch('/api/generate-gdd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData, userId: user?.uid, userCredits: credits }) });
      clearInterval(iv);
      if (!res.ok) { const e = await res.json(); if (e.code === 'INSUFFICIENT_CREDITS') setShowPricing(true); throw new Error(e.error); }
      const data = await res.json();
      if (data.shouldDeductCredit) await deductCredit();
      setProgress(100); setResult(data);
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); clearInterval(iv); }
  };

  const copyClip = async () => { if (result) { await navigator.clipboard.writeText(result.gddText); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  const downloadMD = () => { if (!result) return; const b = new Blob([result.gddText], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${formData.gameName}-GDD.md`; a.click(); };
  const downloadPDF = () => { if (!result) return; const w = window.open('', '_blank'); if (!w) return; w.document.write(`<!DOCTYPE html><html><head><title>${formData.gameName}</title><style>body{font-family:system-ui;padding:40px}h1{color:#7c3aed}h2{color:#8b5cf6;border-bottom:2px solid #e9d5ff}</style></head><body><h1>${formData.gameName}</h1>${result.gddText.replace(/## /g,'<h2>').replace(/\n/g,'<br>')}<script>window.print()</script></body></html>`); w.document.close(); };

  const inp = "w-full h-12 px-4 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
  const txt = "w-full min-h-[100px] px-4 py-3 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none";
  const sel = "w-full h-12 px-4 rounded-xl bg-slate-800/50 border border-violet-500/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer";

  const renderSection = () => {
    switch (currentStep) {
      case 0: return (<div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="text-sm text-slate-300 mb-2 block">Game Name *</label><input className={inp} placeholder="Your game name" value={formData.gameName} onChange={e => updateField('gameName', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Tagline</label><input className={inp} placeholder="Catchy subtitle" value={formData.tagline} onChange={e => updateField('tagline', e.target.value)} /></div></div><div><label className="text-sm text-slate-300 mb-2 block">Genre *</label><select className={sel} value={formData.genre} onChange={e => updateField('genre', e.target.value)}><option value="">Select</option>{GENRES.map(g => <option key={g} value={g}>{g}</option>)}</select></div><div><label className="text-sm text-slate-300 mb-2 block">Platforms</label><div className="flex flex-wrap gap-2">{PLATFORMS.map(p => (<button key={p} type="button" onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-xl text-sm ${formData.platform.includes(p) ? 'bg-violet-500/30 text-violet-300 border-2 border-violet-500' : 'bg-slate-800/50 text-slate-400 border border-violet-500/20'}`}>{formData.platform.includes(p) && <Check className="inline w-4 h-4 mr-1" />}{p}</button>))}</div></div><div><label className="text-sm text-slate-300 mb-2 block">Target Audience</label><textarea className={txt} placeholder="Age, interests" value={formData.targetAudience} onChange={e => updateField('targetAudience', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Unique Selling Points</label><textarea className={txt} placeholder="What makes it unique?" value={formData.uniqueSellingPoints} onChange={e => updateField('uniqueSellingPoints', e.target.value)} /></div></div>);
      case 1: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Core Mechanics *</label><textarea className={txt + " min-h-[120px]"} placeholder="Main gameplay mechanics" value={formData.coreMechanics} onChange={e => updateField('coreMechanics', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Control Scheme</label><textarea className={txt} placeholder="Controls" value={formData.controlScheme} onChange={e => updateField('controlScheme', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Game Loops</label><textarea className={txt} placeholder="Core & meta loops" value={formData.gameLoops} onChange={e => updateField('gameLoops', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Progression</label><textarea className={txt} placeholder="XP, levels, unlocks" value={formData.progressionSystem} onChange={e => updateField('progressionSystem', e.target.value)} /></div></div>);
      case 2: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Story Premise *</label><textarea className={txt + " min-h-[150px]"} placeholder="Your story" value={formData.storyPremise} onChange={e => updateField('storyPremise', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">World Setting</label><textarea className={txt} placeholder="World description" value={formData.worldSetting} onChange={e => updateField('worldSetting', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Main Conflict</label><textarea className={txt} placeholder="Central conflict" value={formData.mainConflict} onChange={e => updateField('mainConflict', e.target.value)} /></div></div>);
      case 3: return (<div className="space-y-6"><div className="flex justify-between items-center"><h3 className="text-lg text-white">Characters</h3><button onClick={addChar} className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-xl text-sm flex items-center gap-2"><Plus className="w-4 h-4" />Add</button></div>{formData.characters.map((c, i) => (<div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-violet-500/20 space-y-3"><div className="flex justify-between"><span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded">{i === 0 ? '⭐ Main' : `#${i+1}`}</span>{formData.characters.length > 1 && <button onClick={() => removeChar(i)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}</div><div className="grid grid-cols-2 gap-3"><input className={inp} placeholder="Name" value={c.name} onChange={e => updateChar(i, 'name', e.target.value)} /><select className={sel} value={c.role} onChange={e => updateChar(i, 'role', e.target.value)}><option value="">Role</option><option value="protagonist">Protagonist</option><option value="antagonist">Antagonist</option><option value="companion">Companion</option></select></div><textarea className={txt} placeholder="Description" value={c.description} onChange={e => updateChar(i, 'description', e.target.value)} /></div>))}</div>);
      case 4: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Number of Levels</label><input type="number" className={inp} placeholder="e.g., 10" value={formData.levelCount} onChange={e => updateField('levelCount', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Level Design</label><textarea className={txt} placeholder="Linear, open world?" value={formData.levelDesignPhilosophy} onChange={e => updateField('levelDesignPhilosophy', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Environments</label><textarea className={txt} placeholder="Forest, city, dungeon..." value={formData.environmentTypes} onChange={e => updateField('environmentTypes', e.target.value)} /></div></div>);
      case 5: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Art Style</label><select className={sel} value={formData.artStyle} onChange={e => updateField('artStyle', e.target.value)}><option value="">Select</option><option value="realistic">Realistic</option><option value="stylized">Stylized</option><option value="pixel">Pixel Art</option><option value="cel-shaded">Cel-Shaded</option></select></div><div><label className="text-sm text-slate-300 mb-2 block">Color Palette</label><textarea className={txt} placeholder="Colors" value={formData.colorPalette} onChange={e => updateField('colorPalette', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">UI Style</label><textarea className={txt} placeholder="HUD, menus" value={formData.uiStyle} onChange={e => updateField('uiStyle', e.target.value)} /></div></div>);
      case 6: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Music Style</label><textarea className={txt} placeholder="Orchestral, electronic..." value={formData.musicStyle} onChange={e => updateField('musicStyle', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Sound Design</label><textarea className={txt} placeholder="SFX, ambience" value={formData.soundDesign} onChange={e => updateField('soundDesign', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Voice Acting</label><select className={sel} value={formData.voiceActing} onChange={e => updateField('voiceActing', e.target.value)}><option value="">Select</option><option value="full">Full</option><option value="partial">Partial</option><option value="none">None</option></select></div></div>);
      case 7: return (<div className="space-y-6"><div className="grid grid-cols-2 gap-6"><div><label className="text-sm text-slate-300 mb-2 block">Engine</label><select className={sel} value={formData.engine} onChange={e => updateField('engine', e.target.value)}><option value="">Select</option>{ENGINES.map(e => <option key={e} value={e}>{e}</option>)}</select></div><div><label className="text-sm text-slate-300 mb-2 block">Target FPS</label><select className={sel} value={formData.targetFPS} onChange={e => updateField('targetFPS', e.target.value)}><option value="">Select</option><option value="30">30</option><option value="60">60</option><option value="120">120</option></select></div></div><div><label className="text-sm text-slate-300 mb-2 block">Min Specs</label><textarea className={txt} placeholder="CPU, GPU, RAM" value={formData.minSpecs} onChange={e => updateField('minSpecs', e.target.value)} /></div></div>);
      case 8: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Business Model</label><select className={sel} value={formData.businessModel} onChange={e => updateField('businessModel', e.target.value)}><option value="">Select</option>{BUSINESS_MODELS.map(m => <option key={m} value={m}>{m}</option>)}</select></div><div><label className="text-sm text-slate-300 mb-2 block">Pricing</label><textarea className={txt} placeholder="Launch price" value={formData.pricingStrategy} onChange={e => updateField('pricingStrategy', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">DLC Plans</label><textarea className={txt} placeholder="Future content" value={formData.dlcPlans} onChange={e => updateField('dlcPlans', e.target.value)} /></div></div>);
      case 9: return (<div className="space-y-6"><div><label className="text-sm text-slate-300 mb-2 block">Launch Date</label><input type="date" className={inp} value={formData.targetLaunchDate} onChange={e => updateField('targetLaunchDate', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Marketing Channels</label><textarea className={txt} placeholder="Social, influencers..." value={formData.marketingChannels} onChange={e => updateField('marketingChannels', e.target.value)} /></div><div><label className="text-sm text-slate-300 mb-2 block">Competitors</label><textarea className={txt} placeholder="Similar games" value={formData.competitorAnalysis} onChange={e => updateField('competitorAnalysis', e.target.value)} /></div></div>);
      default: return null;
    }
  };

  if (authLoading) return (<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center"><Loader2 className="w-10 h-10 text-violet-500 animate-spin" /></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Suspense içinde SearchParams handler */}
      <Suspense fallback={null}>
        <PurchaseSuccessHandler onSuccess={handlePurchaseSuccess} />
      </Suspense>

      <div className="fixed inset-0 overflow-hidden pointer-events-none"><div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" /><div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" /></div>
      
      <header className="relative z-20 border-b border-violet-500/20 bg-slate-900/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg"><Gamepad2 className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">GDD Generator</h1><p className="text-xs text-slate-500">AI-Powered</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowPricing(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500/30 transition-all">
              <Coins className="w-4 h-4" /><span className="font-semibold">{credits}</span><span className="text-xs">Credits</span>
            </button>
            {user && (<div className="flex items-center gap-2 text-slate-400"><div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center overflow-hidden">{user.photoURL ? <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="" /> : <User className="w-4 h-4 text-violet-400" />}</div><span className="text-sm hidden md:block">{user.displayName || user.email?.split('@')[0]}</span></div>)}
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white border border-violet-500/20 rounded-xl hover:bg-violet-500/10"><LogOut className="w-4 h-4" /><span className="hidden md:block">Sign Out</span></button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-sm flex-1">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400"><X className="w-5 h-5" /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl border border-violet-500/20 p-4 sticky top-24">
              <nav className="space-y-1">{SECTIONS.map((s, i) => { const Icon = s.icon; const active = currentStep === i; const done = i < currentStep; return (<button key={s.id} onClick={() => setCurrentStep(i)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${active ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : done ? 'text-slate-300 hover:bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-violet-500/30' : done ? 'bg-emerald-500/20' : 'bg-slate-800/50'}`}>{done ? <Check className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}</div><span className="text-sm">{s.title}</span>{active && <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />}</button>); })}</nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6"><div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Progress</span><span className="text-violet-400 font-semibold">{Math.round(((currentStep + 1) / SECTIONS.length) * 100)}%</span></div><div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${((currentStep + 1) / SECTIONS.length) * 100}%` }} /></div></div>
            
            {error && (<div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 text-sm flex-1">{error}</span><button onClick={() => setError(null)} className="text-red-400"><X className="w-5 h-5" /></button></div>)}
            
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl border border-violet-500/20 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-violet-500/20">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">{React.createElement(SECTIONS[currentStep].icon, { className: 'w-7 h-7 text-violet-400' })}</div>
                <div><h2 className="text-xl font-semibold text-white">{SECTIONS[currentStep].title}</h2><p className="text-sm text-slate-500">Step {currentStep + 1} / {SECTIONS.length}</p></div>
              </div>
              {renderSection()}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 text-slate-300 rounded-xl disabled:opacity-40 border border-violet-500/20"><ChevronLeft className="w-5 h-5" /> Previous</button>
              {currentStep === SECTIONS.length - 1 ? (
                <button onClick={handleGenerate} disabled={isLoading || credits < 1} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-medium disabled:opacity-60 shadow-lg shadow-violet-500/30">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Generating... {Math.round(progress)}%</span></> : <><Sparkles className="w-5 h-5" /><span>Generate GDD</span><span className="text-xs opacity-75">(1 Credit)</span></>}
                </button>
              ) : (<button onClick={() => setCurrentStep(Math.min(SECTIONS.length - 1, currentStep + 1))} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl shadow-lg">Next <ChevronRight className="w-5 h-5" /></button>)}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-violet-500/20 bg-slate-900/80 backdrop-blur-xl mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center"><Gamepad2 className="w-4 h-4 text-white" /></div><span className="text-slate-400 text-sm">© 2025 GDD AI</span></div>
          <div className="flex items-center gap-6"><a href="mailto:guvendevelibau@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-violet-400"><Mail className="w-4 h-4" /><span className="text-sm">guvendevelibau@gmail.com</span></a><a href="https://www.linkedin.com/in/güven-develi-650054396" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-violet-400"><Linkedin className="w-4 h-4" /><span className="text-sm">LinkedIn</span></a></div>
          <div className="text-slate-500 text-sm">Made with <span className="text-red-500">♥</span> by <span className="text-violet-400">Güven Develi</span></div>
        </div>
      </footer>

      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        currentCredits={credits}
        userId={user?.uid || ''}
        userEmail={user?.email || ''}
      />

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl border border-violet-500/30 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-violet-500/20 bg-slate-900/80">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-white" /></div><div><h2 className="text-lg font-bold text-white">{formData.gameName}</h2><p className="text-xs text-slate-400">Game Design Document</p></div></div>
              <div className="flex items-center gap-2">
                <button onClick={copyClip} className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>{copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
                <button onClick={downloadMD} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm flex items-center gap-2"><Download className="w-4 h-4" />MD</button>
                <button onClick={downloadPDF} className="px-4 py-2 bg-fuchsia-500/20 text-fuchsia-300 rounded-xl text-sm flex items-center gap-2"><FileText className="w-4 h-4" />PDF</button>
                <button onClick={() => setResult(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl ml-2"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex border-b border-violet-500/20 bg-slate-900/50">{[{ id: 'gdd', label: 'Document', icon: FileText }, { id: 'flowchart', label: 'Flow Chart', icon: Target }, { id: 'tables', label: 'Tables', icon: Cpu }].map(t => (<button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-2 px-6 py-3 text-sm border-b-2 ${activeTab === t.id ? 'text-violet-400 border-violet-500 bg-violet-500/10' : 'text-slate-400 border-transparent'}`}><t.icon className="w-4 h-4" />{t.label}</button>))}</div>
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'gdd' && <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed font-sans">{result.gddText}</pre>}
              {activeTab === 'flowchart' && result.mermaidChartCode && (<div className="p-6 bg-slate-800/50 rounded-xl border border-violet-500/20"><h3 className="text-violet-400 font-semibold mb-4">Mermaid Code</h3><pre className="text-xs text-slate-400 bg-slate-900/50 p-4 rounded-lg overflow-x-auto">{result.mermaidChartCode}</pre><p className="text-xs text-slate-500 mt-3">View at <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">mermaid.live</a></p></div>)}
              {activeTab === 'tables' && result.mathTableHTML && (<div className="p-6 bg-slate-800/50 rounded-xl border border-violet-500/20"><h3 className="text-violet-400 font-semibold mb-4">Balance Tables</h3><div dangerouslySetInnerHTML={{ __html: result.mathTableHTML }} className="[&_table]:w-full [&_th]:bg-violet-500/20 [&_th]:text-violet-300 [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-violet-500/20 [&_td]:text-slate-300" /></div>)}
              {activeTab === 'flowchart' && !result.mermaidChartCode && <div className="text-center py-12 text-slate-500"><Target className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No chart available</p></div>}
              {activeTab === 'tables' && !result.mathTableHTML && <div className="text-center py-12 text-slate-500"><Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No tables available</p></div>}
            </div>
          </div>
        </div>
      )}

      {isLoading && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm"><div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-8 text-center border border-violet-500/30 shadow-2xl max-w-sm w-full mx-4"><div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg"><Sparkles className="w-10 h-10 text-white animate-pulse" /></div><h3 className="text-xl font-semibold text-white mb-2">Generating GDD</h3><p className="text-slate-400 text-sm mb-6">AI is creating your document...</p><div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${progress}%` }} /></div><p className="text-violet-400 font-semibold text-lg">{Math.round(progress)}%</p></div></div>)}
    </div>
  );
}

// Ana export - Suspense ile sarılmış
export default function GDDGeneratorPage() {
  return <GDDGeneratorContent />;
}
