export interface AgentConfig {
  name: string;
  username?: string;
  modelProvider: string;
  imageModelProvider?: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: Array<Array<{
    user: string;
    content: {
      text: string;
    };
  }>>;
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
  settings?: {
    voice?: {
      model?: string;
    };
    secrets?: Record<string, unknown>;
  };
}

export interface AgentCapabilities {
  modelProvider?: string;
  imageModelProvider?: string;
  topics?: string[];
  messageExamples?: Array<Array<{
    user: string;
    content: {
      text: string;
    };
  }>>;
  postExamples?: string[];
  style?: {
    all: string[];
    chat: string[];
    post: string[];
  };
  settings?: {
    voice?: {
      model?: string;
    };
    secrets?: Record<string, string>;
  };
}

export interface Agent {
  id: string;
  cult_id: string | null;
  name: string;
  description: string | null;
  personality: string | null;
  knowledge: Json | null;
  capabilities: AgentCapabilities | null;
  created_at: string;
  updated_at: string;
  is_active: boolean | null;
}