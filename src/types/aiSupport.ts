export type AiProviderId = "chatgpt" | "openai" | "gemini" | "claude" | "compatible";

export interface AiPublicConfig {
  enabled: boolean;
  ready: boolean;
  welcomeMessage: string;
  quickQuestions: string[];
  provider: AiProviderId;
}

export interface AiAdminConfig {
  provider: AiProviderId;
  apiBaseUrl: string;
  model: string;
  hasKey: boolean;
  keyHint: string;
  systemPrompt: string;
  welcomeMessage: string;
  quickQuestions: string[];
  enabled: boolean;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
}

export interface AiActionResult {
  ok: boolean;
  code?: string;
  message?: string;
  reply?: string;
}