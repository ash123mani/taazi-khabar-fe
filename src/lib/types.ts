export interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

export interface Article {
  id: string;
  source: string;
  headline: string;
  url: string;
  body_text: string | null;
  published_at: string;
  gk_summary: string | null;
  key_terms: string[] | null;
  syllabus_tag: string | null;
  image_url: string | null;
  has_quiz?: boolean;
  is_bookmarked?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  score: number | null;
  total_questions: number;
  time_taken_sec: number | null;
  created_at: string;
  articles: Article[];
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer?: string;
  explanation?: string;
  difficulty?: string;
  selected_answer?: string | null;
}

export interface AIInteraction {
  id: string;
  persona: string;
  prompt: string;
  response: string;
  user_feedback: number | null;
  created_at: string;
}

export interface TrainingDataset {
  id: string;
  name: string;
  description: string | null;
  persona: string;
  num_examples: number;
  status: string;
  lora_adapter_path: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  article_count: number;
  created_at: string;
}

export interface DailyQuizArticleItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  image_url: string | null;
}

export interface DailyQuizCategory {
  id: string;
  name: string;
  article_count: number;
  question_count: number;
  articles: DailyQuizArticleItem[];
}

export interface DailyQuizSummary {
  date: string;
  categories: DailyQuizCategory[];
  total_articles: number;
  total_questions: number;
}

export interface ModelRegistry {
  id: string;
  name: string;
  provider: string;
  status: string;
  model_type: string | null;
  created_at: string;
}
