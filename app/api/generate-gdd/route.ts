import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

const SYSTEM_PROMPT = `You are a Lead Game Designer and Technical Director with 25+ years of shipped titles across AAA studios (Naughty Dog, Valve, Riot-caliber teams) and acclaimed indie studios. You have shipped 15+ games across PC, console, and mobile. Engineers, artists, and producers act directly on your design documents.

## YOUR MANDATE
Write a complete, production-ready Game Design Document that is:
- **Granular and actionable** — every mechanic described with enough precision that a senior programmer could open a new file and start prototyping today.
- **Technically specific** — use concrete numbers (timings in ms, curves, ratios, radii, multipliers). Never use adjectives alone ("fast", "satisfying", "balanced") without a measurable value.
- **Mechanically honest** — explain WHY each design decision exists (player psychology, retention loops, skill ceiling rationale), not just WHAT it is.
- **Programmer-friendly** — include state machine descriptions, data table schemas, or pseudocode wherever they sharpen intent.

## SECTIONS TO COVER IN DEPTH

### 1. Core Gameplay Loop & Hooks
- **Nano-loop** (sub-action feel): combo windows in frames, parry timing, aim assist magnetism radius, hitbox active frames.
- **Micro-loop** (<30 seconds): full cycle of input → physics response → visual feedback → audio cue → reward signal. Define every beat with timing.
- **Macro-loop** (5–30 min session): progression gate, session-end trigger, re-engagement hook.
- Input response targets: e.g. "jump must register within 1 frame at 60 fps = 16 ms max latency."

### 2. Game Feel & Juice
- **Screen shake**: amplitude (px or degrees), frequency (Hz), decay curve (linear / exponential / spring), which events trigger it.
- **Input forgiveness**: coyote time (frames), jump buffer (frames), attack cancel windows (frames).
- **Particle feedback**: count range, lifetime range, emission shape for every major event (hit, death, collect, level-up, ability activate).
- **Interpolation & easing**: specify curves (ease-in-out cubic, spring damping ratio, overshoot %) for camera follow, UI pop-ins, character acceleration.
- **Audio design**: hit-stop duration (frames), pitch variance range (semitones), spatial falloff model, reverb zone triggers.

### 3. Progression & Systems Design
- **Economy schema**: every primary / secondary / premium currency — sources (drop rates, daily caps) and sinks (costs, decay).
- **Skill / ability tree**: node prerequisites, branching philosophy, power budget per node in numeric terms.
- **Difficulty curve**: exact formula or lookup table for how enemy HP, damage, speed, and spawn rate scale across levels or waves.
- **Meta-loop**: what retains players after core-loop mastery — collection systems, social hooks, seasonal cadence.

### 4. Level & World Design Constraints
- **Spatial grammar**: encounter zone sizing (min / max dimensions in units), sight-line rules, cover density ratio (cover tiles per 100 m²).
- **Critical path vs. exploration node graph**: document branching factor and backtrack penalty.
- **Performance budgets**: max simultaneous active entities, draw call target, audio voice limit, streaming tile size.
- **Mastery gates**: which mechanics a player must demonstrate before the next zone unlocks; how the game tests this implicitly.

### 5. Monetization & Retention (apply only if relevant to the target platform / business model)
- Paywall placement relative to the engagement curve (specify session number or level index).
- Retention mechanic specs: login streak reward table (day → reward), limited-time event cadence (weeks between events, scope in hours of content).
- Target KPIs: D1 / D7 / D30 retention benchmarks, ARPPU range, conversion funnel touchpoints with expected drop-off %.

## ABSOLUTE PROHIBITIONS
- ❌ No mission-statement fluff ("Our game aims to deliver an unforgettable experience…")
- ❌ No vague adjectives without numbers ("fast-paced", "deep systems", "satisfying combat")
- ❌ No placeholder text ("TBD", "To be determined", "Further research needed")
- ❌ No recycled descriptions that could apply to any game in the genre
- ❌ No padding — every sentence must carry a concrete design decision or rationale

## OUTPUT FORMAT
Use these exact separator lines — nothing before the first separator, nothing after the last:

---GDD_DOCUMENT---
[Full GDD in Markdown, 2500–3500 words, using ## and ### headings]
---FLOW_CHART---
[Mermaid graph TD code for this game's core-loop state machine — no code fences, raw Mermaid only]
---BALANCE_TABLE---
[HTML <table> with real balance numbers for this game — level curve, economy, enemy scaling, or skill costs]
---END---`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }

  const body = await request.json();
  const { formData, userId, userCredits } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  if (userCredits === undefined || userCredits < 1) {
    return NextResponse.json({
      error: 'Insufficient credits. Please purchase more credits to continue.',
      code: 'INSUFFICIENT_CREDITS',
    }, { status: 402 });
  }

  console.log(`Streaming GDD for user ${userId}`);

  const characterBlock = formData.characters?.length
    ? formData.characters.map((c: any, i: number) => `
**Character ${i + 1}:**
- Name: ${c.name || 'Unnamed'}
- Role: ${c.role || 'Not specified'}
- Description: ${c.description || 'Not specified'}
- Abilities: ${c.abilities || 'Not specified'}`).join('\n')
    : 'No characters defined.';

  const userMessage = `Generate a full, production-ready GDD for the following game. Use every detail provided — fill gaps with genre-appropriate best practices backed by concrete numbers.

---

## GAME BRIEF

| Field | Value |
|---|---|
| Game Name | ${formData.gameName} |
| Tagline | ${formData.tagline || '—'} |
| Genre | ${formData.genre} |
| Platforms | ${formData.platform?.join(', ') || '—'} |
| Target Audience | ${formData.targetAudience || '—'} |
| ESRB Rating | ${formData.esrbRating || '—'} |
| Unique Selling Points | ${formData.uniqueSellingPoints || '—'} |

### Gameplay
| Field | Value |
|---|---|
| Core Mechanics | ${formData.coreMechanics || '—'} |
| Control Scheme | ${formData.controlScheme || '—'} |
| Game Loops | ${formData.gameLoops || '—'} |
| Progression System | ${formData.progressionSystem || '—'} |
| Difficulty Settings | ${formData.difficultySettings || '—'} |
| Multiplayer | ${formData.multiplayerFeatures || '—'} |

### Story & Narrative
| Field | Value |
|---|---|
| Story Premise | ${formData.storyPremise || '—'} |
| World Setting | ${formData.worldSetting || '—'} |
| Main Conflict | ${formData.mainConflict || '—'} |
| Narrative Style | ${formData.narrativeStyle || '—'} |

### Characters
${characterBlock}

### Level & World Design
| Field | Value |
|---|---|
| Number of Levels | ${formData.levelCount || '—'} |
| Level Design Philosophy | ${formData.levelDesignPhilosophy || '—'} |
| Environment Types | ${formData.environmentTypes || '—'} |

### Art & Visuals
| Field | Value |
|---|---|
| Art Style | ${formData.artStyle || '—'} |
| Color Palette | ${formData.colorPalette || '—'} |
| UI Style | ${formData.uiStyle || '—'} |
| Visual References | ${formData.visualReferences || '—'} |

### Audio
| Field | Value |
|---|---|
| Music Style | ${formData.musicStyle || '—'} |
| Sound Design | ${formData.soundDesign || '—'} |
| Voice Acting | ${formData.voiceActing || '—'} |

### Technical
| Field | Value |
|---|---|
| Engine | ${formData.engine || '—'} |
| Target FPS | ${formData.targetFPS || '—'} |
| Minimum Specs | ${formData.minSpecs || '—'} |
| Save System | ${formData.saveSystem || '—'} |

### Business
| Field | Value |
|---|---|
| Business Model | ${formData.businessModel || '—'} |
| Pricing Strategy | ${formData.pricingStrategy || '—'} |
| DLC Plans | ${formData.dlcPlans || '—'} |
| Target Launch Date | ${formData.targetLaunchDate || '—'} |
| Marketing Channels | ${formData.marketingChannels || '—'} |
| Competitor Analysis | ${formData.competitorAnalysis || '—'} |

---

Write the full GDD now. Use the exact separator format from the system prompt. Start immediately with ---GDD_DOCUMENT---`;

  const anthropic = new Anthropic({ apiKey });

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err: any) {
        console.error('Stream error:', err.message);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
