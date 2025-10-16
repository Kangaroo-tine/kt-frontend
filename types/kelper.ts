export interface KelperChatRequest {
  goalId: number | string;
  difficultyReason: number | string;
  userMessage: string;
  [key: string]: unknown;
}

export interface KelperChatResponse {
  code?: string;
  message?: string;
  result?: string;
  success?: boolean;
  [key: string]: unknown;
}
