export type TabType = 'chat' | 'budget' | 'schemes';

// src/types/index.ts (or wherever your types are)
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  structured?: {
    summary?: string;
    details?: string[];
    eligibility?: string;
    nextSteps?: string[];
    confidence?: 'high' | 'medium' | 'low';
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  date: Date;
  notes?: string;
}

export type TransactionCategory = 
  | 'food' 
  | 'rent' 
  | 'travel' 
  | 'education' 
  | 'health' 
  | 'salary'
  | 'investment'
  | 'other';

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  month: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  targetBeneficiary: string;
  keyBenefit: string;
  type: 'central' | 'state';
  state?: string;
  category: SchemeCategory;
  eligibility: string[];
  documents: string[];
  applicationSteps: string[];
  officialLink?: string;
  lastUpdated: Date;
  ageRange?: { min?: number; max?: number };
  incomeLimit?: number;
  gender?: 'male' | 'female' | 'any';
}

export type SchemeCategory = 
  | 'education' 
  | 'housing' 
  | 'agriculture' 
  | 'women' 
  | 'senior' 
  | 'employment'
  | 'health'
  | 'finance';

export interface SchemeFilters {
  category?: SchemeCategory;
  type?: 'central' | 'state';
  state?: string;
  ageRange?: { min?: number; max?: number };
  incomeRange?: { min?: number; max?: number };
  gender?: 'male' | 'female' | 'any';
  search?: string;
}
