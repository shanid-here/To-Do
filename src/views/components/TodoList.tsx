import React from 'react';
import type { Todo } from '../../models/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    editingId: string | null;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onUpdate: (id: string, updates: { text?: string, subtitle?: string, priority?: 'Low' | 'Medium' | 'High', reminder?: string, time?: string }) => void;
    onCancel: () => void;
    onToggle: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    editingId,
    onDelete,
    onEdit,
    onUpdate,
    onCancel,
    onToggle,
}) => {
    if (todos.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No tasks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    isEditing={editingId === todo.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onUpdate={onUpdate}
                    onCancel={onCancel}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
};
