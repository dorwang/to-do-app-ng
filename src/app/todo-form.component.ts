import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * TodoFormComponent - Add New Todo
 * Dumb component: emits form data up
 * Uses Reactive Forms (industry standard for complex forms)
 *
 * Why Reactive Forms?
 * - Type-safe form handling
 * - Easy validation
 * - Good performance (push vs pull)
 * - Better for testing
 */
@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="todo-form">
      <div class="form-group">
        <input 
          type="text" 
          formControlName="title"
          placeholder="What needs to be done?"
          class="form-input"
          aria-label="Todo title">
        @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
          <span class="error">Title is required</span>
        }
      </div>

      <div class="form-group">
        <textarea 
          formControlName="description"
          placeholder="Add details (optional)"
          class="form-textarea"
          aria-label="Todo description"
          rows="2"></textarea>
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          [disabled]="form.invalid"
          class="submit-btn">
          ➕ Add Todo
        </button>
      </div>
    </form>
  `,
  styles: [`
    .todo-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px;
      background: #f9f9f9;
      border: 2px solid #007bff;
      border-radius: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .form-input,
    .form-textarea {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 60px;
    }

    .error {
      color: #dc3545;
      font-size: 0.85rem;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .submit-btn {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .submit-btn:active:not(:disabled) {
      transform: scale(0.98);
    }
  `]
})
export class TodoFormComponent {
  @Output() onAddTodo = new EventEmitter<{ title: string; description?: string; dueDate?: Date }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // Form validation: title is required, min 3 chars
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { title, description } = this.form.value;
    this.onAddTodo.emit({ title, description });
    this.form.reset();
  }
}
