import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Credit packages
export const CREDIT_PACKAGES = {
  FREE: { credits: 2, price: 0, name: 'Free Tier' },
  STARTER: { credits: 10, price: 5, name: 'Starter Pack' },
  PRO: { credits: 50, price: 20, name: 'Pro Pack' },
};

// Get user's current credits
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().credits || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
}

// Initialize new user with free credits
export async function initializeUserCredits(userId: string, email: string, displayName?: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    // Only create if doesn't exist
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        displayName: displayName || '',
        credits: CREDIT_PACKAGES.FREE.credits,
        createdAt: new Date().toISOString(),
        totalCreditsUsed: 0,
        totalCreditsPurchased: 0,
      });
      console.log(`Initialized user ${userId} with ${CREDIT_PACKAGES.FREE.credits} free credits`);
    }
  } catch (error) {
    console.error('Error initializing user credits:', error);
    throw error;
  }
}

// Deduct 1 credit from user
export async function deductCredit(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error('User not found');
      return false;
    }
    
    const currentCredits = userSnap.data().credits || 0;
    
    if (currentCredits < 1) {
      return false;
    }
    
    await updateDoc(userRef, {
      credits: increment(-1),
      totalCreditsUsed: increment(1),
      lastUsedAt: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error('Error deducting credit:', error);
    return false;
  }
}

// Add credits to user (for purchases)
export async function addCredits(userId: string, amount: number, packageName: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      credits: increment(amount),
      totalCreditsPurchased: increment(amount),
      lastPurchaseAt: new Date().toISOString(),
      lastPackage: packageName,
    });
    
    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
}

// Check if user has enough credits
export async function hasEnoughCredits(userId: string, required: number = 1): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits >= required;
}