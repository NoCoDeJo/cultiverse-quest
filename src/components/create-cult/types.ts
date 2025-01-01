export type Message = {
  type: 'system' | 'user' | 'assistant';
  content: string;
  field?: string;
};

export type FormDataType = {
  name: string;
  description: string;
  cult_type: 'dev' | 'agent';
  custom_url?: string;
};

export type Step = 'name' | 'description' | 'type' | 'complete';