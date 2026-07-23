export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  currency: "USD" | "BRL";
  type: "income" | "expense";
  status: "Cleared" | "Pending" | "Reviewed";
  aiReviewed?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  used: number;
}

export interface Leak {
  id: string;
  name: string;
  cost: number;
  reason: string;
  category: string;
  status: "active" | "cancelled" | "ignored" | "consolidated" | "challenged";
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  nextDue: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface OcrLog {
  id: string;
  timestamp: string;
  merchant: string;
  amount: number;
  currency: string;
  success: boolean;
}

export interface AppData {
  transactions: Transaction[];
  goals: Goal[];
  cards: CreditCard[];
  leaks: Leak[];
  recurring: RecurringExpense[];
  chatMessages: ChatMessage[];
  budget: Budget[];
  ocrLogs: OcrLog[];
}
