import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const { formData, userId, userCredits } = body;

    // Check if user has credits
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (userCredits === undefined || userCredits < 1) {
      return NextResponse.json({ 
        error: 'Insufficient credits. Please purchase more credits to continue.',
        code: 'INSUFFICIENT_CREDITS'
      }, { status: 402 });
    }

    console.log(`Generating GDD for user ${userId} with ${userCredits} credits`);

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are an expert game designer with 20+ years of experience at AAA studios. Create an extremely detailed, professional Game Design Document (GDD) based on the following information.

## GAME INFORMATION PROVIDED:
- **Game Name:** ${formData.gameName}
- **Tagline:** ${formData.tagline || 'Not specified'}
- **Genre:** ${formData.genre}
- **Platforms:** ${formData.platform?.join(', ') || 'Not specified'}
- **Target Audience:** ${formData.targetAudience || 'Not specified'}
- **Unique Selling Points:** ${formData.uniqueSellingPoints || 'Not specified'}

### GAMEPLAY
- **Core Mechanics:** ${formData.coreMechanics || 'Not specified'}
- **Control Scheme:** ${formData.controlScheme || 'Not specified'}
- **Game Loops:** ${formData.gameLoops || 'Not specified'}
- **Progression System:** ${formData.progressionSystem || 'Not specified'}
- **Difficulty Settings:** ${formData.difficultySettings || 'Not specified'}
- **Multiplayer Features:** ${formData.multiplayerFeatures || 'Not specified'}

### STORY & NARRATIVE
- **Story Premise:** ${formData.storyPremise || 'Not specified'}
- **World Setting:** ${formData.worldSetting || 'Not specified'}
- **Main Conflict:** ${formData.mainConflict || 'Not specified'}
- **Narrative Style:** ${formData.narrativeStyle || 'Not specified'}

### CHARACTERS
${formData.characters?.map((c: any, i: number) => `
**Character ${i + 1}:**
- Name: ${c.name || 'Unnamed'}
- Role: ${c.role || 'Not specified'}
- Description: ${c.description || 'Not specified'}
- Abilities: ${c.abilities || 'Not specified'}
`).join('') || 'No characters defined'}

### LEVELS & WORLD
- **Number of Levels:** ${formData.levelCount || 'Not specified'}
- **Level Design Philosophy:** ${formData.levelDesignPhilosophy || 'Not specified'}
- **Environment Types:** ${formData.environmentTypes || 'Not specified'}

### ART & VISUALS
- **Art Style:** ${formData.artStyle || 'Not specified'}
- **Color Palette:** ${formData.colorPalette || 'Not specified'}
- **UI Style:** ${formData.uiStyle || 'Not specified'}

### AUDIO
- **Music Style:** ${formData.musicStyle || 'Not specified'}
- **Sound Design:** ${formData.soundDesign || 'Not specified'}
- **Voice Acting:** ${formData.voiceActing || 'Not specified'}

### TECHNICAL
- **Game Engine:** ${formData.engine || 'Not specified'}
- **Target FPS:** ${formData.targetFPS || 'Not specified'}
- **Minimum Specs:** ${formData.minSpecs || 'Not specified'}

### BUSINESS
- **Business Model:** ${formData.businessModel || 'Not specified'}
- **Pricing Strategy:** ${formData.pricingStrategy || 'Not specified'}
- **DLC Plans:** ${formData.dlcPlans || 'Not specified'}

---

Create a comprehensive, professional GDD with these sections:
1. Executive Summary
2. Game Overview & Core Pillars
3. Gameplay Systems (mechanics, controls, loops)
4. Narrative Design (story, world, characters)
5. Level Design
6. Art Direction
7. Audio Design
8. Technical Specifications
9. Monetization & Business Model
10. Production Timeline

## OUTPUT FORMAT:
Respond with ONLY a valid JSON object:

{
  "gddText": "FULL GDD IN MARKDOWN FORMAT (3000+ words, detailed, professional)",
  "mermaidChartCode": "graph TD\\n    A[Start] --> B[Main Menu]\\n    B --> C[Gameplay]\\n    C --> D{Challenge}\\n    D -->|Win| E[Reward]\\n    D -->|Lose| F[Retry]\\n    E --> C\\n    F --> C",
  "mathTableHTML": "<table><thead><tr><th>Level</th><th>XP</th><th>HP</th><th>Attack</th></tr></thead><tbody><tr><td>1</td><td>0</td><td>100</td><td>10</td></tr><tr><td>2</td><td>100</td><td>120</td><td>12</td></tr><tr><td>3</td><td>250</td><td>145</td><td>15</td></tr><tr><td>4</td><td>475</td><td>175</td><td>18</td></tr><tr><td>5</td><td>815</td><td>210</td><td>22</td></tr></tbody></table>"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    let responseText = content.text;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Return with flag indicating credit should be deducted
        return NextResponse.json({ ...parsed, shouldDeductCredit: true });
      } else {
        return NextResponse.json({
          gddText: responseText,
          mermaidChartCode: '',
          mathTableHTML: '',
          shouldDeductCredit: true
        });
      }
    } catch (parseError) {
      return NextResponse.json({
        gddText: responseText,
        mermaidChartCode: '',
        mathTableHTML: '',
        shouldDeductCredit: true
      });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: `API error: ${error.message}` }, { status: 500 });
  }
}