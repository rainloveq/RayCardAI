export interface User {
  id: string;
  email: string;
  displayName: string;
  points: number;
  createdAt: string;
}

export interface Card {
  id: string;
  userId: string;
  originalImageUrl: string;
  generatedImageUrl?: string | null;
  festival: string;
  styleId: string;
  styleType: 'character' | 'illustration';
  decorations: string[];
  greetingText: string;
  extraInstructions?: string | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  taskId?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  referenceId?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  amountHKD: number;
  points: number;
  stripeSessionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}
