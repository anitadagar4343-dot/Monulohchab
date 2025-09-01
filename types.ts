import type { ReactNode } from 'react';

export enum AppMode {
  Freeform = 'freeform',
  Chat = 'chat',
  Image = 'image',
  Video = 'video',
}

export interface ModelParams {
  temperature: number;
  topK: number;
  topP: number;
}

export interface HistoryItem {
  id: string;
  mode: AppMode;
  prompt: string;
  output: ReactNode;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}