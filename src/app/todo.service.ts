import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './todo.model';

/**
 * TodoService
 * Manages all todo-related business logic.
 * Acts as a centralized state manager and repository for todo data.
 *
 * Why a Service?
 * - Single responsibility: handles data logic, not UI
 * - Reusable across components
 * - Easy to test independently
 *
 * Why BehaviorSubject?
 * - Components can subscribe to state changes in real-time
 * - Last value is always available to new subscribers
 * - Perfect for reactive architecture
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private todosSubject = new BehaviorSubject<Todo[]>(this.loadFromStorage());

  // Expose todos as observable - components subscribe, never directly access array
  public todos$ = this.todosSubject.asObservable();

  constructor() {
    this.syncToStorage();
  }

  /**
   * Add a new todo
   * Generates unique ID and sets creation timestamp
   */
  addTodo(title: string, description?: string, dueDate?: Date): void {
    const newTodo: Todo = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate
    };

    const current = this.todosSubject.value;
    this.todosSubject.next([...current, newTodo]);
  }

  /**
   * Update an existing todo
   * Maintains immutability by creating new array
   */
  updateTodo(id: string, updates: Partial<Todo>): void {
    const current = this.todosSubject.value;
    const updated = current.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    this.todosSubject.next(updated);
  }

  /**
   * Toggle completion status
   * Shorthand for common operation
   */
  toggleTodo(id: string): void {
    const todo = this.todosSubject.value.find(t => t.id === id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
  }

  /**
   * Delete a todo
   * Filter it out from the array
   */
  deleteTodo(id: string): void {
    const current = this.todosSubject.value;
    this.todosSubject.next(current.filter(todo => todo.id !== id));
  }

  /**
   * Get single todo by ID
   * Useful for edit views
   */
  getTodoById(id: string): Todo | undefined {
    return this.todosSubject.value.find(todo => todo.id === id);
  }

  /**
   * Clear all completed todos
   * Common feature in todo apps
   */
  clearCompleted(): void {
    const current = this.todosSubject.value;
    this.todosSubject.next(current.filter(todo => !todo.completed));
  }

  /**
   * Load todos from localStorage
   * Runs on service initialization
   */
  private loadFromStorage(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load todos from storage:', error);
      return [];
    }
  }

  /**
   * Sync todos to localStorage whenever they change
   * Ensures persistence across browser sessions
   */
  private syncToStorage(): void {
    this.todosSubject.subscribe(todos => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Failed to save todos to storage:', error);
      }
    });
  }

  /**
   * Generate unique ID
   * Simple UUID-like string for demo purposes
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
