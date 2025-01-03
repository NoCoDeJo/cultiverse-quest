export interface Profile {
  id: string;
  sacred_name: string;
  worthiness_score: number | null;
  profile_image_url?: string | null;
  description?: string | null;
}