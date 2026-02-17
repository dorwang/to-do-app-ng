import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Todo } from './todo.model';

/**
 * TodoItemComponent - Single Todo Display
 * Dumb component: receives 1 todo, emits events
 */
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <input 
        type="checkbox" 
        [checked]="todo.completed"
        (change)="toggle()"
        class="todo-checkbox"
        aria-label="Toggle todo completion">
      
      <div class="todo-content">
        <h3 class="todo-title">{{ todo.title }}</h3>
        @if (todo.description) {
          <p class="todo-description">{{ todo.description }}</p>
        }
        <small class="todo-date">
          Created: {{ todo.createdAt | date: 'short' }}
        </small>
      </div>

      <button (click)="delete()" class="delete-btn" aria-label="Delete todo">
        ❌
      </button>
    </div>
  `,
  styles: [`
    .todo-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 15px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      transition: all 0.2s;
    }

    .todo-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-color: #007bff;
    }

    .todo-item.completed {
      background: #f9f9f9;
      opacity: 0.7;
    }

    .todo-checkbox {
      margin-top: 2px;
      cursor: pointer;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-title {
      margin: 0 0 5px 0;
      font-size: 1rem;
      color: #333;
    }

    .todo-item.completed .todo-title {
      text-decoration: line-through;
      color: #999;
    }

    .todo-description {
      margin: 5px 0;
      font-size: 0.9rem;
      color: #666;
    }

    .todo-date {
      display: block;
      font-size: 0.8rem;
      color: #999;
      margin-top: 5px;
    }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 5px;
      opacity: 0.6;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .delete-btn:hover {
      opacity: 1;
    }
  `]
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() onToggle = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  toggle(): void {
    this.onToggle.emit(this.todo.id);
  }

  delete(): void {
    this.onDelete.emit(this.todo.id);
  }
}
