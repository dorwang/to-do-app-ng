import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';
import { Observable } from 'rxjs';
import { TodoListComponent } from './todo-list.component';
import { TodoFormComponent } from './todo-form.component';

/**
 * AppComponent (Smart/Container Component)
 * 
 * This is the ROOT component that orchestrates the entire app.
 * 
 * Why "Smart Component"?
 * - Knows about services and business logic
 * - Manages state (communicates with TodoService)
 * - Passes data DOWN to dumb components via @Input
 * - Listens to events UP from dumb components via @Output
 * 
 * This follows the Container/Presentational pattern:
 * Smart (here) → handles logic, data fetching
 * Dumb (children) → pure UI, no service dependencies
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  todos$!: Observable<Todo[]>;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Subscribe to the service's observable stream
    // Any component using async pipe will auto-subscribe/unsubscribe
    this.todos$ = this.todoService.todos$;
  }

  /**
   * Called when form emits a new todo
   * Delegates to service (business logic stays in service)
   */
  onAddTodo(data: { title: string; description?: string; dueDate?: Date }): void {
    this.todoService.addTodo(data.title, data.description, data.dueDate);
  }

  /**
   * Called when todo item is toggled
   */
  onToggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  /**
   * Called when todo item is deleted
   */
  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  /**
   * Clear all completed todos
   * Useful button for users
   */
  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
