import type { ModelParams } from './types';
import { AppMode } from './types';

export const DEFAULT_PARAMS: ModelParams = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
};

export const EXAMPLE_PROMPTS: Record<string, { title: string; prompt: string }[]> = {
  [AppMode.Freeform]: [
    { title: 'Explain a concept', prompt: 'Explain the concept of quantum entanglement in simple terms.' },
    { title: 'Write a poem', prompt: 'Write a short poem about the city of Tokyo at night.' },
    { title: 'Summarize text', prompt: 'Summarize the following text for a 5th grader:\n\n[Paste long text here]' },
  ],
  [AppMode.Chat]: [
    { title: 'Creative writing partner', prompt: 'Let\'s write a story together. I\'ll start: The old lighthouse keeper found a mysterious, glowing shell on the beach...' },
    { title: 'Plan a trip', prompt: 'Help me plan a 3-day trip to Paris. I\'m interested in art, history, and food.' },
  ],
  [AppMode.Image]: [
    { title: 'A futuristic city', prompt: 'A photorealistic image of a futuristic city with flying cars and holographic advertisements, at sunset.' },
    { title: 'An astronaut cat', prompt: 'A majestic cat wearing a detailed astronaut suit, floating in space with Earth in the background, digital art.' },
    { title: 'Surreal landscape', prompt: 'A surreal landscape where the rivers are made of liquid rainbows and the trees have clouds for leaves.' },
  ],
  [AppMode.Video]: [
    { title: 'A cat driving', prompt: 'A neon hologram of a cat driving at top speed' },
    { title: 'Surfing astronaut', prompt: 'An astronaut surfing on a wave of cosmic dust, with nebulae in the background.' },
    { title: 'Timelapse flower', prompt: 'A timelapse video of a rare, bioluminescent flower blooming in a dark forest.' },
  ],
};

export const IconSparkles = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-7.184c0-1.681.673-3.28 1.816-4.416ZM12.75 8.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    <path d="M10.743 19.084a8.25 8.25 0 0 0-8.486-8.486.75.75 0 0 1-1.06-1.061 9.75 9.75 0 0 1 10.606 10.606.75.75 0 0 1-1.06-1.06Z" />
  </svg>
);

export const IconMessage = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.75.75 0 0 0-.629.904 49.088 49.088 0 0 1-3.058 7.226.75.75 0 0 1-1.332 0A49.088 49.088 0 0 1 8.33 18.39a.75.75 0 0 0-.63-.904 48.901 48.901 0 0 1-3.475-.383C1.37 16.822 0 15.09 0 13.144V7.124c0-1.946 1.37-3.678 3.348-3.97Z" clipRule="evenodd" />
  </svg>
);

export const IconImage = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06l2.755-2.754a.75.75 0 0 1 1.06 0l3.996 3.995a.75.75 0 0 0 1.06 0l2.492-2.491a.75.75 0 0 1 1.218.06l3.693 4.432V6.75a.75.75 0 0 0-.75-.75H3.75a.75.75 0 0 0-.75.75v9.31Z" clipRule="evenodd" />
  </svg>
);

export const IconVideo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 3.75A.75.75 0 0 1 5.25 3h13.5a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V3.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
        <path d="M1.5 6.75a.75.75 0 0 1 .75-.75H3v12H2.25a.75.75 0 0 1-.75-.75V6.75Z" />
        <path d="M22.5 6.75a.75.75 0 0 0-.75-.75H21v12h.75a.75.75 0 0 0 .75-.75V6.75Z" />
    </svg>
);

export const IconCode = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M13.828 4.172a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06L17.657 10l-3.829-3.828a.75.75 0 0 1 0-1.06Zm-3.656 0a.75.75 0 0 0-1.06 0L4.612 8.672a.75.75 0 0 0 0 1.06l4.5 4.5a.75.75 0 1 0 1.06-1.06L6.343 10l3.829-3.828a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
    </svg>
);

export const IconCopy = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.16 12.66 9 11.625 9h-1.5A2.625 2.625 0 0 1 7.5 6.375v-3Z" />
        <path d="M14.625 9h-1.5a2.625 2.625 0 0 0-2.625 2.625v3.375c0 1.036.84 1.875 1.875 1.875h.375a3.75 3.75 0 0 0 3.75-3.75V11.25A2.25 2.25 0 0 0 14.625 9Z" />
        <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036-.84 1.875-1.875 1.875h-1.5A2.625 2.625 0 0 1 3 11.625v-3Z" />
        <path d="M10.5 16.875c0 1.036.84 1.875 1.875 1.875h.375a3.75 3.75 0 0 0 3.75-3.75v-1.875c0-1.036-.84-1.875-1.875-1.875h-1.5a2.625 2.625 0 0 0-2.625 2.625v3.375Z" />
    </svg>
);