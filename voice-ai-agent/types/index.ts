/**
 * Core domain types shared across the app. These mirror the database models
 * we'll create in Phase 8 (Prisma), but live here as plain TypeScript so the
 * frontend and services can share them without a DB dependency yet.
 */

export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string; // ISO timestamp
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export * from "./voice";
