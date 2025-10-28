export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  updateTime?: string;
  resources?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: 'chat' | 'robot' | 'review' | 'code' | 'cloud' | 'terminal' | 'web' | 'plugin' | 'test' | 'star';
}

export interface News {
  id: string;
  title: string;
  url: string;
  updateTime: string;
  description?: string;
  tool?: string;
}

export interface AINews {
  id: string;
  title: string;
  url: string;
  updateTime: string;
  description?: string;
  category?: string;
}