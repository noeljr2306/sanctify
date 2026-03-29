export const DAILY_PROMPTS: string[] = [
  "What is God asking of me today through today's Gospel?",
  "Where did I see God's presence in my day?",
  "What am I holding onto that I need to surrender to God?",
  "How did I love others today the way Christ loves me?",
  "What sin or weakness do I want to bring to God in prayer?",
  "What am I most grateful for today, and why?",
  "How is God calling me to grow in virtue this week?",
  "What moment today made me feel closest to God?",
  "Where do I need more trust in God's providence?",
  "How can I serve someone in need this week?",
  "What does today's Scripture reveal about who God is?",
  "Am I at peace? If not, what is troubling my soul?",
  "How am I growing in prayer? What distracts me?",
  "What would my life look like if I truly trusted God completely?",
  "Who needs my prayers today? Why are they on my heart?",
  "What does my heart most desire — and is it aligned with God's will?",
  "How have I experienced God's mercy recently?",
  "What is one concrete way I can grow in holiness this week?",
  "How am I living out my vocation as a Christian today?",
  "What do I find most difficult about following Jesus? Why?",
];

// Get today's prompt deterministically (rotates daily)
export function getTodayPrompt(): string {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_PROMPTS[day % DAILY_PROMPTS.length];
}
