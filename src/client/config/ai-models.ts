/**
 * SACC Tower - AI Models Connector
 * ==================================
 * 
 * This configuration file registers all AI/LLM models available for use
 * in the AI Assistant interface. Models can be:
 * - Public API (requires API key)
 * - Enterprise (requires organizational license)
 * - Self-hosted (on-premise or private cloud)
 * 
 * HOW TO CONFIGURE:
 * 1. Add new models to the appropriate category array
 * 2. Set connection details (apiEndpoint, authType)
 * 3. Set `enabled: true/false` to activate/deactivate models
 * 4. Set capabilities to describe what the model excels at
 * 
 * SUPPORTED AUTH TYPES:
 * - "api_key"     : Requires API key in Authorization header
 * - "oauth2"      : OAuth 2.0 client credentials
 * - "bearer"      : Bearer token authentication
 * - "session"     : Browser session / SSO-based
 * - "none"        : No authentication (local/self-hosted)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ModelCategory =
  | "general_purpose"
  | "code_generation"
  | "image_generation"
  | "video_generation"
  | "embedding"
  | "specialized"
  | "open_source";

export type ModelCapability =
  | "chat"
  | "code"
  | "reasoning"
  | "vision"
  | "image-generation"
  | "video-generation"
  | "audio"
  | "embedding"
  | "function-calling"
  | "long-context"
  | "real-time"
  | "search";

export interface ModelAuth {
  type: "api_key" | "oauth2" | "bearer" | "session" | "none";
  /** Header name for API key (e.g., "Authorization", "X-API-Key") */
  headerName?: string;
  /** API key value — stored AES-256-GCM encrypted (base64) */
  apiKeyEncrypted?: string;
  /** OAuth2 Client ID — stored AES-256-GCM encrypted */
  clientIdEncrypted?: string;
  /** OAuth2 Client Secret — stored AES-256-GCM encrypted */
  clientSecretEncrypted?: string;
  /** Token endpoint for OAuth2 */
  tokenUrl?: string;
  /** Custom headers (JSON string, encrypted if contains secrets) */
  customHeadersEncrypted?: string;
  /** Organization / Project ID (some APIs require this, e.g. OpenAI) */
  organizationId?: string;
  /** Registration/signup URL */
  registrationUrl?: string;
  /** Notes on how to get access */
  accessNotes?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  providerDescription: string;
  description: string;
  category: ModelCategory;
  capabilities: ModelCapability[];
  apiEndpoint: string;
  auth: ModelAuth;
  enabled: boolean;
  /** Context window size in tokens */
  contextWindow?: number;
  /** Maximum output tokens */
  maxOutput?: number;
  /** Pricing tier indicator */
  pricingTier?: "free" | "pay-per-use" | "subscription" | "enterprise";
  /** Model version identifier */
  version?: string;
  /** Last verified working date */
  lastVerified?: string;
}

// ============================================================================
// OPENAI MODELS
// ============================================================================

const OPENAI_PROVIDER = {
  provider: "OpenAI",
  providerDescription: "OpenAI is an AI research and deployment company founded in 2015. Creator of GPT-4, ChatGPT, DALL·E, and Whisper, it is one of the leading organizations in large language model development with over 200 million weekly active users.",
};

const OPENAI_AUTH: ModelAuth = {
  type: "api_key",
  headerName: "Authorization",
  registrationUrl: "https://platform.openai.com/signup",
  accessNotes: "Create an account at platform.openai.com. API key required with billing enabled.",
};

const OPENAI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    ...OPENAI_PROVIDER,
    description: "Most capable multimodal model. Excels at complex reasoning, code generation, creative writing, and vision tasks with fast response times.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "long-context"],
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    auth: OPENAI_AUTH,
    enabled: true,
    contextWindow: 128000,
    maxOutput: 16384,
    pricingTier: "pay-per-use",
    version: "gpt-4o-2024-08-06",
    lastVerified: "2024-12-01",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    ...OPENAI_PROVIDER,
    description: "Lightweight and cost-efficient model for simpler tasks. Good balance of capability and speed for everyday coding assistance and text generation.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling"],
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    auth: OPENAI_AUTH,
    enabled: true,
    contextWindow: 128000,
    maxOutput: 16384,
    pricingTier: "pay-per-use",
    version: "gpt-4o-mini-2024-07-18",
    lastVerified: "2024-12-01",
  },
  {
    id: "o1",
    name: "OpenAI o1",
    ...OPENAI_PROVIDER,
    description: "Advanced reasoning model that 'thinks before answering'. Excels at complex math, science, coding challenges, and multi-step logical problems.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "long-context"],
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    auth: OPENAI_AUTH,
    enabled: true,
    contextWindow: 200000,
    maxOutput: 100000,
    pricingTier: "pay-per-use",
    version: "o1-2024-12-17",
    lastVerified: "2024-12-01",
  },
  {
    id: "dall-e-3",
    name: "DALL·E 3",
    ...OPENAI_PROVIDER,
    description: "State-of-the-art image generation model. Creates detailed, accurate images from text descriptions with strong prompt adherence.",
    category: "image_generation",
    capabilities: ["image-generation"],
    apiEndpoint: "https://api.openai.com/v1/images/generations",
    auth: OPENAI_AUTH,
    enabled: true,
    pricingTier: "pay-per-use",
    version: "dall-e-3",
    lastVerified: "2024-12-01",
  },
  {
    id: "openai-sora",
    name: "Sora",
    ...OPENAI_PROVIDER,
    description: "Video generation model capable of creating realistic videos from text prompts. Produces up to 60-second videos with complex scenes and motion.",
    category: "video_generation",
    capabilities: ["video-generation"],
    apiEndpoint: "https://api.openai.com/v1/video/generations",
    auth: OPENAI_AUTH,
    enabled: true,
    pricingTier: "subscription",
    version: "sora-2024",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// ANTHROPIC MODELS
// ============================================================================

const ANTHROPIC_PROVIDER = {
  provider: "Anthropic",
  providerDescription: "Anthropic is an AI safety company founded in 2021 by former OpenAI researchers. It develops the Claude family of AI assistants, known for helpfulness, harmlessness, and honesty, with strong capabilities in analysis, coding, and long-context understanding.",
};

const ANTHROPIC_AUTH: ModelAuth = {
  type: "api_key",
  headerName: "x-api-key",
  registrationUrl: "https://console.anthropic.com/",
  accessNotes: "Create an account at console.anthropic.com. API key required with billing enabled.",
};

const ANTHROPIC_MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    ...ANTHROPIC_PROVIDER,
    description: "Anthropic's best model for intelligent coding, analysis, and complex reasoning. Excellent instruction-following with strong safety properties.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "long-context"],
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    auth: ANTHROPIC_AUTH,
    enabled: true,
    contextWindow: 200000,
    maxOutput: 64000,
    pricingTier: "pay-per-use",
    version: "claude-sonnet-4-20250514",
    lastVerified: "2024-12-01",
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    ...ANTHROPIC_PROVIDER,
    description: "Most powerful Claude model for the hardest tasks. Sustained performance on long, complex coding projects and deep research with extended thinking.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "long-context"],
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    auth: ANTHROPIC_AUTH,
    enabled: true,
    contextWindow: 200000,
    maxOutput: 64000,
    pricingTier: "pay-per-use",
    version: "claude-opus-4-20250514",
    lastVerified: "2024-12-01",
  },
  {
    id: "claude-haiku-35",
    name: "Claude 3.5 Haiku",
    ...ANTHROPIC_PROVIDER,
    description: "Fast and cost-effective model for lightweight tasks. Good for quick code reviews, simple Q&A, and high-throughput applications.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling"],
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    auth: ANTHROPIC_AUTH,
    enabled: true,
    contextWindow: 200000,
    maxOutput: 8192,
    pricingTier: "pay-per-use",
    version: "claude-3-5-haiku-20241022",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// GOOGLE MODELS
// ============================================================================

const GOOGLE_PROVIDER = {
  provider: "Google DeepMind",
  providerDescription: "Google DeepMind is an AI research lab formed by the merger of DeepMind and Google Brain in 2023. It develops the Gemini family of models and is responsible for breakthrough AI research including AlphaFold and AlphaGo.",
};

const GOOGLE_AUTH: ModelAuth = {
  type: "api_key",
  headerName: "x-goog-api-key",
  registrationUrl: "https://aistudio.google.com/",
  accessNotes: "Get API key from Google AI Studio or Google Cloud Console with Vertex AI enabled.",
};

const GOOGLE_MODELS: AIModel[] = [
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    ...GOOGLE_PROVIDER,
    description: "Google's most capable thinking model with 1M token context window. Excellent at code, math, reasoning, and multimodal understanding.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "long-context", "audio"],
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
    auth: GOOGLE_AUTH,
    enabled: true,
    contextWindow: 1000000,
    maxOutput: 65536,
    pricingTier: "pay-per-use",
    version: "gemini-2.5-pro-preview-06-05",
    lastVerified: "2024-12-01",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    ...GOOGLE_PROVIDER,
    description: "Fast, cost-efficient model with thinking capabilities. Good balance of speed and intelligence for everyday tasks.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "long-context"],
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    auth: GOOGLE_AUTH,
    enabled: true,
    contextWindow: 1000000,
    maxOutput: 65536,
    pricingTier: "pay-per-use",
    version: "gemini-2.5-flash-preview-05-20",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// MICROSOFT / GITHUB MODELS
// ============================================================================

const MICROSOFT_MODELS: AIModel[] = [
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    provider: "Microsoft / GitHub",
    providerDescription: "GitHub Copilot is an AI coding assistant developed by GitHub (Microsoft) that provides real-time code suggestions, chat-based coding help, and automated pull request reviews. It uses multiple AI models including GPT-4o and Claude.",
    description: "AI pair programmer providing inline code completions, chat assistance, and code review. Supports 30+ languages with IDE integration (VS Code, JetBrains, Neovim).",
    category: "code_generation",
    capabilities: ["code", "chat", "function-calling"],
    apiEndpoint: "https://api.githubcopilot.com/chat/completions",
    auth: { type: "bearer", registrationUrl: "https://github.com/features/copilot", accessNotes: "GitHub Copilot subscription required ($10/month individual, $19/month business)." },
    enabled: true,
    pricingTier: "subscription",
    version: "copilot-2024",
    lastVerified: "2024-12-01",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI Service",
    provider: "Microsoft Azure",
    providerDescription: "Microsoft Azure provides enterprise-grade access to OpenAI models through its cloud platform. It offers data residency, compliance certifications, virtual network support, and content filtering for regulated industries.",
    description: "Enterprise deployment of OpenAI models (GPT-4o, o1, DALL·E) on Azure with data privacy, compliance, and VNet integration for regulated environments.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "function-calling", "embedding"],
    apiEndpoint: "https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions",
    auth: { type: "api_key", headerName: "api-key", registrationUrl: "https://azure.microsoft.com/en-us/products/ai-services/openai-service", accessNotes: "Azure subscription required. Apply for access at the Azure portal." },
    enabled: true,
    contextWindow: 128000,
    pricingTier: "enterprise",
    version: "2024-08-01-preview",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// META MODELS (Open Source)
// ============================================================================

const META_MODELS: AIModel[] = [
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    providerDescription: "Meta Platforms (formerly Facebook) develops the open-source Llama family of LLMs. Llama models are freely available for research and commercial use, making advanced AI accessible to the broader developer community.",
    description: "Meta's latest open-source large language model. Strong performance on code, reasoning, and multilingual tasks. Can be self-hosted or accessed via cloud providers.",
    category: "open_source",
    capabilities: ["chat", "code", "reasoning", "function-calling", "long-context"],
    apiEndpoint: "https://api.together.xyz/v1/chat/completions",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://www.together.ai/", accessNotes: "Available via Together AI, Fireworks, Groq, or self-hosted. Open weights downloadable from huggingface.co/meta-llama." },
    enabled: true,
    contextWindow: 128000,
    maxOutput: 4096,
    pricingTier: "pay-per-use",
    version: "llama-3.3-70b-instruct",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// MISTRAL MODELS
// ============================================================================

const MISTRAL_MODELS: AIModel[] = [
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    providerDescription: "Mistral AI is a French AI company founded in 2023 by former Meta and Google DeepMind researchers. It develops high-performance open and commercial models, positioning itself as Europe's leading AI foundation model company.",
    description: "Mistral's flagship model with strong multilingual capabilities, function calling, and code generation. Competitive with GPT-4 class models at lower cost.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "function-calling", "long-context"],
    apiEndpoint: "https://api.mistral.ai/v1/chat/completions",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://console.mistral.ai/", accessNotes: "Create account at console.mistral.ai. API key with billing required." },
    enabled: true,
    contextWindow: 128000,
    maxOutput: 4096,
    pricingTier: "pay-per-use",
    version: "mistral-large-latest",
    lastVerified: "2024-12-01",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "Mistral AI",
    providerDescription: "Mistral AI is a French AI company founded in 2023 by former Meta and Google DeepMind researchers. It develops high-performance open and commercial models, positioning itself as Europe's leading AI foundation model company.",
    description: "Mistral's dedicated code model trained on 80+ programming languages. Optimized for code generation, completion, and documentation with fill-in-the-middle support.",
    category: "code_generation",
    capabilities: ["code", "chat"],
    apiEndpoint: "https://codestral.mistral.ai/v1/chat/completions",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://console.mistral.ai/", accessNotes: "Codestral API key required (separate from main Mistral key)." },
    enabled: true,
    contextWindow: 32000,
    maxOutput: 4096,
    pricingTier: "pay-per-use",
    version: "codestral-latest",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// xAI MODELS
// ============================================================================

const XAI_MODELS: AIModel[] = [
  {
    id: "grok-3",
    name: "Grok-3",
    provider: "xAI",
    providerDescription: "xAI is an AI company founded by Elon Musk in 2023. It develops the Grok family of models with real-time information access, humor-aware responses, and strong reasoning capabilities, available through the X platform and API.",
    description: "xAI's most capable model with strong reasoning, real-time knowledge, and code generation. Features DeepSearch for grounded answers and a distinctive conversational style.",
    category: "general_purpose",
    capabilities: ["chat", "code", "reasoning", "vision", "search", "real-time"],
    apiEndpoint: "https://api.x.ai/v1/chat/completions",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://console.x.ai/", accessNotes: "xAI API account required. Sign up at console.x.ai." },
    enabled: true,
    contextWindow: 131072,
    maxOutput: 16384,
    pricingTier: "pay-per-use",
    version: "grok-3",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// SPECIALIZED MODELS
// ============================================================================

const SPECIALIZED_MODELS: AIModel[] = [
  {
    id: "perplexity-sonar",
    name: "Perplexity Sonar",
    provider: "Perplexity AI",
    providerDescription: "Perplexity AI is a search-focused AI company that combines LLMs with real-time web search to provide cited, factual answers. It serves over 100 million queries monthly as an 'answer engine' alternative to traditional search.",
    description: "Search-augmented AI model that provides real-time, cited answers by combining LLM reasoning with live web search. Ideal for research and fact-checking.",
    category: "specialized",
    capabilities: ["chat", "search", "real-time"],
    apiEndpoint: "https://api.perplexity.ai/chat/completions",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://www.perplexity.ai/settings/api", accessNotes: "Perplexity API key required. Pro subscription provides higher limits." },
    enabled: true,
    contextWindow: 127072,
    pricingTier: "pay-per-use",
    version: "sonar-pro",
    lastVerified: "2024-12-01",
  },
  {
    id: "cohere-command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    providerDescription: "Cohere is a Canadian AI company focused on enterprise NLP. It provides models optimized for search, retrieval-augmented generation (RAG), and business text understanding, with deployment options across major cloud providers.",
    description: "Enterprise-optimized model excelling at retrieval-augmented generation (RAG), tool use, and multilingual tasks. Strong for business document processing.",
    category: "specialized",
    capabilities: ["chat", "function-calling", "embedding", "search"],
    apiEndpoint: "https://api.cohere.ai/v2/chat",
    auth: { type: "api_key", headerName: "Authorization", registrationUrl: "https://dashboard.cohere.com/", accessNotes: "Cohere account with API key. Free tier available for experimentation." },
    enabled: true,
    contextWindow: 128000,
    pricingTier: "pay-per-use",
    version: "command-r-plus-08-2024",
    lastVerified: "2024-12-01",
  },
];

// ============================================================================
// EXPORTED MODEL REGISTRY
// ============================================================================

export const AI_MODELS: AIModel[] = [
  ...OPENAI_MODELS,
  ...ANTHROPIC_MODELS,
  ...GOOGLE_MODELS,
  ...MICROSOFT_MODELS,
  ...META_MODELS,
  ...MISTRAL_MODELS,
  ...XAI_MODELS,
  ...SPECIALIZED_MODELS,
];

export function getEnabledModels(): AIModel[] {
  return AI_MODELS.filter((m) => m.enabled);
}

export function getModelsByCategory(category: ModelCategory): AIModel[] {
  return AI_MODELS.filter((m) => m.enabled && m.category === category);
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export const MODEL_CATEGORY_LABELS: Record<ModelCategory, string> = {
  general_purpose: "General Purpose",
  code_generation: "Code Generation",
  image_generation: "Image Generation",
  video_generation: "Video Generation",
  embedding: "Embedding",
  specialized: "Specialized",
  open_source: "Open Source",
};

export const CAPABILITY_LABELS: Record<ModelCapability, string> = {
  chat: "Chat",
  code: "Code",
  reasoning: "Reasoning",
  vision: "Vision",
  "image-generation": "Image Gen",
  "video-generation": "Video Gen",
  audio: "Audio",
  embedding: "Embedding",
  "function-calling": "Functions",
  "long-context": "Long Context",
  "real-time": "Real-Time",
  search: "Search",
};
