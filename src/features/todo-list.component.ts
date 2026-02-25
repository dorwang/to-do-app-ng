import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from './todo.model';
import { TodoItemComponent } from './todo-item.component';

/**
 * TodoListComponent (Dumb/Presentational Component)
 *
 * Why "Dumb"?
 * - Receives data via @Input (todos)
 * - Sends events up via @Output (onToggle, onDelete)
 * - Has NO service dependencies
 * - Pure: same input always produces same output
 * - Easy to test: just pass data, verify output
 */
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="todo-list-wrapper">
      <div class="stats">
        <span class="stat">📊 {{ getTotalCount() }} todos</span>
        <span class="stat">✅ {{ getCompletedCount() }} completed</span>
      </div>

      <div class="todo-list">
        @if (todos && todos.length > 0) {
          @for (todo of todos; track todo.id) {
            <app-todo-item 
              [todo]="todo"
              (onToggle)="onToggleItem($event)"
              (onDelete)="onDeleteItem($event)">
            </app-todo-item>
          }
        } @else {
          <div class="empty-state">
            <p>🎉 No todos yet! Add one to get started.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-list-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats {
      display: flex;
      gap: 20px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 5px;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #555;
    }

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 60px;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      background: #f5f5f5;
      border-radius: 5px;
      color: #888;
      font-style: italic;
    }
  `]
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = null;
  @Output() onToggle = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  onToggleItem(id: string): void {
    this.onToggle.emit(id);
  }

  onDeleteItem(id: string): void {
    this.onDelete.emit(id);
  }

  getCompletedCount(): number {
    return this.todos?.filter(t => t.completed).length || 0;
  }

  getTotalCount(): number {
    return this.todos?.length || 0;
  }
}
