export interface Cult {
  id: string;
  name: string;
  description: string | null;
  theme_color: string | null;
  logo_url: string | null;
  founder_id: string | null;
  visibility: string | null;
  twitter_handle: string | null;
  cult_type: 'dev' | 'agent';
  parent_cult_id: string | null;
  linked_agents_count: number | null;
  created_at: string;
  updated_at: string;
}