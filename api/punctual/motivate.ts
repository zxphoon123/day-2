import type { Request, Response } from 'express';

const personaFallbacks: Record<string, Array<{ quote: string; author: string; tag: string; punctualityTip: string }>> = {
  singlish: [
    {
      quote: "Steady pom pi pi! Leaving now means you get your morning kopi-o and sit down nice and shiok.",
      author: "Uncle Lim, Veteran Kopitiam Lao Ban",
      tag: "Singlish Hype",
      punctualityTip: "Board near the middle carriages (Door 3/4) for direct escalator exit to avoid queue.",
    },
    {
      quote: "Don't kancheong spider! Just walk briskly, tap your card chop chop, and secure that empty MRT seat!",
      author: "Auntie Helen, MRT Commuter Champion",
      tag: "Singlish Hype",
      punctualityTip: "Prep your SimplyGo phone tap before reaching the gantry so nobody can 'tsk' you.",
    },
    {
      quote: "Aiyo, early 5 minutes is hero, late 1 minute becomes zero. Walk fast, reach early, drink teh tarik!",
      author: "Uncle Raymond, Bishan Station Regular",
      tag: "Singlish Hype",
      punctualityTip: "Use the sheltered linkway—rain or shine you still walk fast like wind.",
    },
    {
      quote: "Wah lau, leave now steady! Beat the school crowd and reach your destination like a champion boss.",
      author: "Tanjong Pagar Taxi Uncle",
      tag: "Singlish Hype",
      punctualityTip: "Stand at the marked platform arrows so you step in the second doors open.",
    },
    {
      quote: "Swee la! Tap in early, catch the express bus, and relax inside the air-con like VIP.",
      author: "Bedok Interchange Captain",
      tag: "Singlish Hype",
      punctualityTip: "Check the overhead arrival board so you don't run for a train that's not yours.",
    },
    {
      quote: "Don't say bo jio! Step out the house right now, zero ERP headache and zero stress!",
      author: "Jurong East MRT Marshall",
      tag: "Singlish Hype",
      punctualityTip: "Keep to the left on escalators—let the fast-walkers pass smoothly.",
    },
    {
      quote: "Huak ah! Early bird gets the seat and the fresh kaya toast before the morning queue starts!",
      author: "Maxwell Food Centre Aunty",
      tag: "Singlish Hype",
      punctualityTip: "Tap card with phone in right hand for optimal fare-gate sensor alignment.",
    },
  ],
  inspirational: [
    {
      quote: "Time is the ultimate leverage in the CBD. Arriving early commands the room before anyone else speaks.",
      author: "Marcus Vance, Shenton Way Managing Director",
      tag: "High-Flyer Hustle",
      punctualityTip: "Use train travel time for high-value prep: review key agenda items before arrival.",
    },
    {
      quote: "Excellence is not an accident—it begins with owning the clock and mastering your morning transit.",
      author: "Elena Neo, Venture Capitalist & 6AM Club",
      tag: "High-Flyer Hustle",
      punctualityTip: "Board the direct express link to bypass 20 minutes of road gridlock.",
    },
    {
      quote: "Winners never fight traffic—they anticipate it, execute their departure, and win the morning.",
      author: "Peak Commute Strategist",
      tag: "High-Flyer Hustle",
      punctualityTip: "A 5-minute departure buffer eliminates 95% of transit friction and anxiety.",
    },
    {
      quote: "Discipline is the bridge between intention and reputation. Arrive early, set the pace, own your outcomes.",
      author: "CBD Executive Coach",
      tag: "High-Flyer Hustle",
      punctualityTip: "Align with exit car 4 for instantaneous transfer at Marina Bay / Raffles Place.",
    },
    {
      quote: "Your reputation is built in minutes, not years. Being punctual signals unwavering competence.",
      author: "Julian Chen, Fintech Founder",
      tag: "High-Flyer Hustle",
      punctualityTip: "Schedule your departure to arrive 10 minutes prior to mentally prime for high stakes.",
    },
    {
      quote: "While competitors are caught in rush-hour traffic, leaders are already executing in the boardroom.",
      author: "Victoria Sterling, Strategy Partner",
      tag: "High-Flyer Hustle",
      punctualityTip: "Download offline documents before transit to maintain uninterrupted momentum.",
    },
  ],
  witty: [
    {
      quote: "Leave now so you can stroll in casually looking like a genius rather than sprinting like an Olympic sweaty mess.",
      author: "Late-Again Larry, Corporate Stand-up",
      tag: "Witty Banter",
      punctualityTip: "Position yourself directly below the MRT AC vents to instantly cool down in 30 seconds.",
    },
    {
      quote: "Being on time means you never have to make awkward eye contact with your boss while sneaking past their desk.",
      author: "Office Survival Specialist",
      tag: "Witty Banter",
      punctualityTip: "Skip the lift queue: taking the station stairs burns calories and saves 3 critical minutes.",
    },
    {
      quote: "Save $35 in surge taxi fees by taking the train right now—that's literally 6 cups of premium bubble tea.",
      author: "Financial Commuter Guru",
      tag: "Witty Banter",
      punctualityTip: "The faster you get through the fare gates, the longer you get to pretend to work on your phone.",
    },
    {
      quote: "Legend says people who arrive 10 minutes early get to pick the best conference room swivel chair.",
      author: "Senior Swivel Chair Connoisseur",
      tag: "Witty Banter",
      punctualityTip: "Keep your bag in front of you on crowded trains to glide through exits effortlessly.",
    },
    {
      quote: "If you leave right this second, you don't even have to rehearse your 'sorry MRT delayed' speech.",
      author: "Chief Excuse Officer (CEO)",
      tag: "Witty Banter",
      punctualityTip: "Walk at 5.5 km/h instead of 4 km/h to shave a full 4 minutes off your last-mile walk.",
    },
    {
      quote: "The only thing faster than the Downtown Line is your heart rate when you leave the house 10 minutes late.",
      author: "Transit Satirist",
      tag: "Witty Banter",
      punctualityTip: "Avoid the middle door bottlenecks by queueing at the far end of the platform.",
    },
  ],
  zen: [
    {
      quote: "The train arrives when it arrives, but your calm is always within. Walk mindfully and flow with the journey.",
      author: "Master Kai, Commuter Zen Monk",
      tag: "Zen Calm",
      punctualityTip: "Take 3 deep belly breaths while waiting on the platform to reset your nervous system.",
    },
    {
      quote: "Do not rush against time; move in harmony with it. A peaceful departure creates a tranquil arrival.",
      author: "The Mindful Commuter",
      tag: "Zen Calm",
      punctualityTip: "Let your shoulders relax as the train accelerates. The commute is your moving sanctuary.",
    },
    {
      quote: "In the midst of the bustling city crowd, maintain your inner silence. You are on time, and all is well.",
      author: "Serene Traveler",
      tag: "Zen Calm",
      punctualityTip: "Focus your eyes on the horizon or a fixed point to cultivate grounded stillness in transit.",
    },
    {
      quote: "Breathe in peace, exhale tension. Each step toward your destination is an act of gentle presence.",
      author: "Dharma Transit Guide",
      tag: "Zen Calm",
      punctualityTip: "Listen to ambient sounds without judgment as you transition smoothly between stations.",
    },
    {
      quote: "Time does not run out; it simply unfolds. Walk with presence and grace, one step at a time.",
      author: "Platform Philosopher",
      tag: "Zen Calm",
      punctualityTip: "Unhurry your pace by leaving 5 minutes earlier; serenity is the greatest luxury.",
    },
    {
      quote: "A quiet mind turns a crowded carriage into a space of peaceful reflection.",
      author: "Mindful Transit Circle",
      tag: "Zen Calm",
      punctualityTip: "Gently soften your gaze during transit to release digital eye strain and tension.",
    },
  ],
};

export default async function handler(req: Request, res: Response) {
  const { tone = 'singlish', destination = 'work / meeting', currentDelayMin = 0, excludeQuote = '' } = req.body || {};

  const normalizedTone = (tone.toLowerCase() === 'high-flyer' || tone.toLowerCase() === 'high_flyer')
    ? 'inspirational'
    : tone.toLowerCase();

  const personaQuotes = personaFallbacks[normalizedTone] || personaFallbacks.singlish;
  const filteredQuotes = excludeQuote
    ? personaQuotes.filter((item) => item.quote !== excludeQuote)
    : personaQuotes;
  const quotePool = filteredQuotes.length > 0 ? filteredQuotes : personaQuotes;

  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey || rawKey.includes('MY_GEMINI') || rawKey === 'undefined') {
    const randomPick = quotePool[Math.floor(Math.random() * quotePool.length)];
    return res.status(200).json(randomPick);
  }

  const sanitizedKey = rawKey.replace(/^["']|["']$/g, '').trim();

  const personaGuidelines: Record<string, string> = {
    singlish: `PERSONA: Uncle / Auntie Singaporean Commuter Legend (Singlish Hype).
STYLE: Authentic, humorous, warm colloquial Singaporean Singlish with terms like 'steady pom pi pi', 'kancheong spider', 'chop chop', 'kopi-o', 'alamak', 'chope', 'shiok', 'tapao'.
AUTHOR: Character like 'Uncle Lim (Kopitiam Boss)' or 'Auntie Helen (Commuter Champion)'.
TAG: 'Singlish Hype'`,

    inspirational: `PERSONA: Shenton Way / CBD High-Flyer Executive (High-Flyer Hustle).
STYLE: Sharp, ambitious, high-energy executive mindset. Focus on time as currency, competitive edge, 6 AM club discipline.
AUTHOR: Character like 'Marcus Vance (Shenton Way MD)' or 'Elena Neo (Venture Partner)'.
TAG: 'High-Flyer Hustle'`,

    witty: `PERSONA: Sarcastic, Relatable Modern Office Commuter (Witty Banter).
STYLE: Funny, sarcastic observations about avoiding boss eye contact, Singapore weather sprint vs air-con MRT, taxi surge fees.
AUTHOR: Character like 'Late-Again Larry (Office Comedian)' or 'Senior Swivel Chair Strategist'.
TAG: 'Witty Banter'`,

    zen: `PERSONA: Mindful Transit Monk (Zen Calm).
STYLE: Peaceful, stoic, grounded, poetic. Seeing the MRT commute as a moving sanctuary.
AUTHOR: Character like 'Master Kai (Commuter Zen Monk)' or 'The Mindful Commuter'.
TAG: 'Zen Calm'`,
  };

  const personaInstruction = personaGuidelines[normalizedTone] || personaGuidelines.singlish;

  try {
    const prompt = `You are the Singapore Punctuality Coach ("SG I am Late Pro Punctuality Booster").
Generate a customized, highly encouraging punctuality message for a commuter heading to "${destination}".
${currentDelayMin > 0 ? `Current situation: Commuter is delayed by ${currentDelayMin} minutes.` : 'Current situation: Commuter is heading out now to arrive ahead of time.'}
${excludeQuote ? `Do NOT repeat or use this quote: "${excludeQuote}"` : ''}

${personaInstruction}

Respond ONLY with valid JSON in this exact structure:
{
  "quote": "1-2 punchy sentences in character voice",
  "author": "Character name with title",
  "tag": "Tone label",
  "punctualityTip": "1 practical actionable micro-tip for Singapore transit"
}`;

    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': sanitizedKey,
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.9 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            if (parsed && parsed.quote) {
              return res.status(200).json(parsed);
            }
          }
        }
      } catch {
        // Continue to next model
      }
    }
  } catch {
    // Fall back to quote bank
  }

  const randomPick = quotePool[Math.floor(Math.random() * quotePool.length)];
  return res.status(200).json(randomPick);
}
