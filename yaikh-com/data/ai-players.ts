/**
 * The major Ai players tracked by the Yai Ai feed — who they are, where
 * they originate, and the brand key the classifier tags stories with.
 * Clicking a player card on /ai-feed filters the feed to their stories.
 */

export type AiPlayer = {
  brand: string; // must match the classifier's BRANDS vocabulary
  name: string;
  flag: string;
  country: string;
  hq: string;
  blurb: string;
};

export const AI_PLAYERS: AiPlayer[] = [
  {
    brand: "OpenAI",
    name: "OpenAI",
    flag: "🇺🇸",
    country: "USA",
    hq: "San Francisco",
    blurb: "Maker of ChatGPT and the GPT model family.",
  },
  {
    brand: "Anthropic",
    name: "Anthropic",
    flag: "🇺🇸",
    country: "USA",
    hq: "San Francisco",
    blurb: "Safety-focused lab behind the Claude models.",
  },
  {
    brand: "Google",
    name: "Google · DeepMind",
    flag: "🇺🇸",
    country: "USA / UK",
    hq: "Mountain View · London",
    blurb: "Gemini models, DeepMind research, Vertex AI cloud.",
  },
  {
    brand: "Meta",
    name: "Meta AI",
    flag: "🇺🇸",
    country: "USA",
    hq: "Menlo Park",
    blurb: "Open-weight Llama models and consumer Ai.",
  },
  {
    brand: "Microsoft",
    name: "Microsoft",
    flag: "🇺🇸",
    country: "USA",
    hq: "Redmond",
    blurb: "Copilot everywhere; OpenAI's biggest backer.",
  },
  {
    brand: "xAI",
    name: "xAI",
    flag: "🇺🇸",
    country: "USA",
    hq: "San Francisco",
    blurb: "Elon Musk's lab behind the Grok models.",
  },
  {
    brand: "Mistral",
    name: "Mistral AI",
    flag: "🇫🇷",
    country: "France",
    hq: "Paris",
    blurb: "Europe's open-model champion.",
  },
  {
    brand: "Alibaba",
    name: "Alibaba · Qwen",
    flag: "🇨🇳",
    country: "China",
    hq: "Hangzhou",
    blurb: "Qwen open models and Alibaba Cloud Ai.",
  },
  {
    brand: "DeepSeek",
    name: "DeepSeek",
    flag: "🇨🇳",
    country: "China",
    hq: "Hangzhou",
    blurb: "Efficient frontier models at disruptive cost.",
  },
  {
    brand: "ByteDance",
    name: "ByteDance",
    flag: "🇨🇳",
    country: "China",
    hq: "Beijing",
    blurb: "Doubao models and Ai-powered consumer apps.",
  },
  {
    brand: "Nvidia",
    name: "Nvidia",
    flag: "🇺🇸",
    country: "USA",
    hq: "Santa Clara",
    blurb: "The GPUs the whole Ai industry runs on.",
  },
];
