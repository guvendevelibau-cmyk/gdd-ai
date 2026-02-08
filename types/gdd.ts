// types/gdd.ts - Type definitions for GDD Generator

export interface Character {
  name: string;
  role: string;
  description: string;
  abilities: string;
}

export interface GDDFormData {
  // Overview
  gameName: string;
  tagline: string;
  genre: string;
  platform: string[];
  targetAudience: string;
  esrbRating: string;
  uniqueSellingPoints: string;

  // Gameplay
  coreMechanics: string;
  controlScheme: string;
  gameLoops: string;
  progressionSystem: string;
  difficultySettings: string;
  multiplayerFeatures: string;

  // Story
  storyPremise: string;
  worldSetting: string;
  mainConflict: string;
  narrativeStyle: string;

  // Characters
  characters: Character[];

  // Levels
  levelCount: string;
  levelDesignPhilosophy: string;
  environmentTypes: string;

  // Art
  artStyle: string;
  colorPalette: string;
  uiStyle: string;
  visualReferences: string;

  // Audio
  musicStyle: string;
  soundDesign: string;
  voiceActing: string;

  // Technical
  engine: string;
  minSpecs: string;
  targetFPS: string;
  saveSystem: string;

  // Monetization
  businessModel: string;
  pricingStrategy: string;
  dlcPlans: string;

  // Marketing
  targetLaunchDate: string;
  marketingChannels: string;
  competitorAnalysis: string;
}

export interface GDDResponse {
  gddText: string;
  mermaidChartCode: string;
  mathTableHTML: string;
}

export interface APIError {
  error: string;
  details?: string;
}

// Initial form state
export const initialFormData: GDDFormData = {
  gameName: '',
  tagline: '',
  genre: '',
  platform: [],
  targetAudience: '',
  esrbRating: '',
  uniqueSellingPoints: '',
  coreMechanics: '',
  controlScheme: '',
  gameLoops: '',
  progressionSystem: '',
  difficultySettings: '',
  multiplayerFeatures: '',
  storyPremise: '',
  worldSetting: '',
  mainConflict: '',
  narrativeStyle: '',
  characters: [{ name: '', role: '', description: '', abilities: '' }],
  levelCount: '',
  levelDesignPhilosophy: '',
  environmentTypes: '',
  artStyle: '',
  colorPalette: '',
  uiStyle: '',
  visualReferences: '',
  musicStyle: '',
  soundDesign: '',
  voiceActing: '',
  engine: '',
  minSpecs: '',
  targetFPS: '',
  saveSystem: '',
  businessModel: '',
  pricingStrategy: '',
  dlcPlans: '',
  targetLaunchDate: '',
  marketingChannels: '',
  competitorAnalysis: '',
};

// Constants
export const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'Xbox Series X/S',
  'Nintendo Switch',
  'Mobile (iOS)',
  'Mobile (Android)',
  'Web Browser',
];

export const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Puzzle',
  'Sports',
  'Racing',
  'Fighting',
  'Horror',
  'Platformer',
  'Shooter',
  'Survival',
  'MMO',
  'Roguelike',
  'Metroidvania',
  'Visual Novel',
  'Rhythm',
];

export const ENGINES = [
  'Unity',
  'Unreal Engine 5',
  'Godot',
  'GameMaker',
  'RPG Maker',
  'Custom Engine',
  'Phaser',
  'Construct 3',
];

export const BUSINESS_MODELS = [
  'Premium (Tek Seferlik Satın Alma)',
  'Free-to-Play',
  'Freemium',
  'Subscription',
  'Ad-Supported',
  'Early Access',
];

export const ART_STYLES = [
  { value: 'realistic', label: 'Gerçekçi (Realistic)' },
  { value: 'stylized', label: 'Stilize' },
  { value: 'pixel-art', label: 'Pixel Art' },
  { value: 'cel-shaded', label: 'Cel-Shaded' },
  { value: 'low-poly', label: 'Low Poly' },
  { value: 'hand-drawn', label: 'El Çizimi' },
  { value: 'anime', label: 'Anime/Manga' },
  { value: 'voxel', label: 'Voxel' },
  { value: 'isometric', label: 'İzometrik' },
];

export const NARRATIVE_STYLES = [
  { value: 'linear', label: 'Doğrusal (Linear)' },
  { value: 'branching', label: 'Dallanan (Branching)' },
  { value: 'open', label: 'Açık Dünya (Open)' },
  { value: 'emergent', label: 'Ortaya Çıkan (Emergent)' },
  { value: 'environmental', label: 'Çevresel Hikaye Anlatımı' },
];

export const VOICE_ACTING_OPTIONS = [
  { value: 'full', label: 'Tam Seslendirme' },
  { value: 'partial', label: 'Kısmi Seslendirme' },
  { value: 'gibberish', label: 'Yapay Dil (Gibberish)' },
  { value: 'text-only', label: 'Sadece Metin' },
];

export const SAVE_SYSTEMS = [
  { value: 'auto', label: 'Otomatik Kayıt' },
  { value: 'checkpoint', label: 'Checkpoint Sistemi' },
  { value: 'manual', label: 'Manuel Kayıt' },
  { value: 'hybrid', label: 'Hibrit (Otomatik + Manuel)' },
  { value: 'roguelike', label: 'Roguelike (Kalıcı Ölüm)' },
];

export const CHARACTER_ROLES = [
  { value: 'protagonist', label: 'Protagonist (Kahraman)' },
  { value: 'antagonist', label: 'Antagonist (Düşman)' },
  { value: 'companion', label: 'Yoldaş' },
  { value: 'npc', label: 'NPC' },
  { value: 'boss', label: 'Boss' },
  { value: 'mentor', label: 'Mentor' },
];
