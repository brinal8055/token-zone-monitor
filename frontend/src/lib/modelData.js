export const PROVIDERS = [
  { key: 'claude', label: 'Anthropic / Claude' },
  { key: 'openai', label: 'OpenAI' },
  { key: 'gemini', label: 'Google Gemini' },
];

export const MODELS = {
  claude: [
    'claude-opus-4-6',
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-3-5',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
  ],
  openai: [
    'gpt-4o',
    'gpt-4o-mini',
    'o3',
    'o3-mini',
    'gpt-4-turbo',
    'gpt-4',
  ],
  gemini: [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
  ],
};

export const MODEL_LIMITS = {
  // Anthropic
  'claude-opus-4-6':            { rpm: '2,000', tpm: '4M',    ctx: '200K', out: '32K',  tier: 'Tier 1' },
  'claude-opus-4-5':            { rpm: '50',    tpm: '20K',   ctx: '200K', out: '32K',  tier: 'Tier 1' },
  'claude-sonnet-4-5':          { rpm: '500',   tpm: '80K',   ctx: '200K', out: '16K',  tier: 'Tier 1' },
  'claude-haiku-3-5':           { rpm: '1,000', tpm: '100K',  ctx: '200K', out: '8K',   tier: 'Tier 1' },
  'claude-3-opus-20240229':     { rpm: '50',    tpm: '20K',   ctx: '200K', out: '4K',   tier: 'Tier 1' },
  'claude-3-sonnet-20240229':   { rpm: '500',   tpm: '40K',   ctx: '200K', out: '4K',   tier: 'Tier 1' },
  // OpenAI
  'gpt-4o':       { rpm: '500',   tpm: '450K', ctx: '128K', out: '16K',  tier: 'Tier 1' },
  'gpt-4o-mini':  { rpm: '500',   tpm: '200K', ctx: '128K', out: '16K',  tier: 'Tier 1' },
  'o3':           { rpm: '100',   tpm: '200K', ctx: '200K', out: '100K', tier: 'Tier 1' },
  'o3-mini':      { rpm: '500',   tpm: '200K', ctx: '200K', out: '100K', tier: 'Tier 1' },
  'gpt-4-turbo':  { rpm: '500',   tpm: '450K', ctx: '128K', out: '4K',   tier: 'Tier 1' },
  'gpt-4':        { rpm: '500',   tpm: '40K',  ctx: '8K',   out: '8K',   tier: 'Tier 1' },
  // Google
  'gemini-2.0-flash':      { rpm: '2,000', tpm: '4M',   ctx: '1M',  out: '8K',  tier: 'Free/Paid' },
  'gemini-2.0-flash-lite': { rpm: '4,000', tpm: '4M',   ctx: '1M',  out: '8K',  tier: 'Free/Paid' },
  'gemini-1.5-pro':        { rpm: '360',   tpm: '4M',   ctx: '2M',  out: '8K',  tier: 'Paid' },
  'gemini-1.5-flash':      { rpm: '1,000', tpm: '4M',   ctx: '1M',  out: '8K',  tier: 'Free/Paid' },
  'gemini-1.0-pro':        { rpm: '360',   tpm: '120K', ctx: '32K', out: '8K',  tier: 'Paid' },
};

export const ZONE_CONFIG = {
  offpeak: {
    key: 'offpeak',
    label: 'OFF-PEAK',
    color: '#22c55e',
    bgGlow: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.35)',
    demand: 'LOW DEMAND',
    text: 'Best time to run heavy workloads.',
    subtext: 'Low latency & full throughput.',
    rec: 'Great time to work',
    recSub: 'Full throughput available',
    score: 20,
    badgeBg: 'rgba(34, 197, 94, 0.15)',
  },
  moderate: {
    key: 'moderate',
    label: 'MODERATE',
    color: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    demand: 'MODERATE DEMAND',
    text: 'Proceed with caution.',
    subtext: 'Avoid large context windows.',
    rec: 'Proceed carefully',
    recSub: 'Monitor latency closely',
    score: 55,
    badgeBg: 'rgba(245, 158, 11, 0.15)',
  },
  peak: {
    key: 'peak',
    label: 'PEAK',
    color: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    demand: 'HIGH DEMAND',
    text: 'Defer heavy workloads.',
    subtext: 'Expect higher latency & rate limits.',
    rec: 'Defer heavy tasks',
    recSub: 'High latency expected',
    score: 90,
    badgeBg: 'rgba(239, 68, 68, 0.15)',
  },
};
