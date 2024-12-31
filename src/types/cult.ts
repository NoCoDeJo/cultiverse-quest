export interface Cult {
  id: string;
  name: string;
  description: string;
  theme_color: string;
  logo_url: string | null;
  founder_id: string | null;
  visibility: string;
  twitter_handle: string | null;
  cult_type: 'dev' | 'agent';
  parent_cult_id: string | null;
  linked_agents_count: number;
}