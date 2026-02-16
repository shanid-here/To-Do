import { useState, useEffect } from 'react';
import type { Todo } from '../models/Todo';

export const useTodoViewModel = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('ziya_todos');
        return saved ? JSON.parse(saved) : [];
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddScreenOpen, setIsAddScreenOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        localStorage.setItem('ziya_todos', JSON.stringify(todos));
    }, [todos]);

    const getFormattedDate = (date: Date) => {
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };

    const filteredTodos = todos.filter(todo => {
        if (!todo.date) return true; // Show undated tasks everywhere? Or maybe just on "today"? Let's assume undated = today for simplicity or legacy.
        // Better: if legacy tasks have no date, show them today. 
        // Or better: Assign today to new tasks, so checking date match is safer.
        // For now, let's match exact date string.
        return todo.date === getFormattedDate(selectedDate);
    });

    const addTodo = (text: string, subtitle?: string, time?: string, priority?: 'Low' | 'Medium' | 'High', reminder?: string) => {
        if (!text.trim()) return;
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            subtitle,
            time,
            isCompleted: false,
            createdAt: Date.now(),
            priority,
            reminder,
            date: getFormattedDate(selectedDate)
        };
        setTodos((prev) => [newTodo, ...prev]);
        setIsAddScreenOpen(false);
    };

    // ... delete, startEditing, cancelEditing, updateTodo, toggleTodo SAME as before ...

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const startEditing = (id: string) => {
        setEditingId(id);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const updateTodo = (id: string, updates: { text?: string, subtitle?: string, priority?: 'Low' | 'Medium' | 'High', reminder?: string, time?: string }) => {
        setTodos((prev) =>
            prev.map((todo) => {
                if (todo.id !== id) return todo;
                return {
                    ...todo,
                    ...updates,
                };
            })
        );
        setEditingId(null);
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            )
        );
    };

    const openAddScreen = () => setIsAddScreenOpen(true);
    const closeAddScreen = () => setIsAddScreenOpen(false);

    return {
        todos: filteredTodos,
        editingId,
        isAddScreenOpen,
        addTodo,
        deleteTodo,
        startEditing,
        cancelEditing,
        updateTodo,
        toggleTodo,
        openAddScreen,
        closeAddScreen,
        selectedDate,
        selectDate: setSelectedDate,
    };
};
