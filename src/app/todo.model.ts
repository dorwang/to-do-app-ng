/**
 * Todo Model
 * Defines the structure of a todo item.
 * This interface ensures type safety throughout the app.
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}
