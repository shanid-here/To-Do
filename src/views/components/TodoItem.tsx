import type { Todo } from '../../models/Todo';
import { Bell, Save, X, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

interface TodoItemProps {
    todo: Todo;
    isEditing: boolean;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onUpdate: (id: string, updates: { text?: string, subtitle?: string, priority?: 'Low' | 'Medium' | 'High', reminder?: string, time?: string }) => void;
    onCancel: () => void;
    onToggle: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    isEditing,
    onToggle,
    onDelete,
    onEdit,
    onUpdate,
    onCancel,
}) => {
    const [editText, setEditText] = useState(todo.text);
    const [editSubtitle, setEditSubtitle] = useState(todo.subtitle || '');
    const [editPriority, setEditPriority] = useState<'Low' | 'Medium' | 'High'>(todo.priority || 'Low');
    const [editReminder, setEditReminder] = useState(todo.reminder || '');

    const handleToggle = () => {
        if (!todo.isCompleted) {
            // Celebrate completion
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF4500', '#ADFF2F', '#00BFFF']
            });

            const congratulations = [
                "Great job! 🎉",
                "Task crushed! 💪",
                "You're on fire! 🔥",
                "Way to go! 🚀",
                "Keep it up! ✨",
                "Awesome work! 🌟"
            ];
            const randomMsg = congratulations[Math.floor(Math.random() * congratulations.length)];
            toast.success(randomMsg);
        }
        onToggle(todo.id);
    };

    const handleUpdate = () => {
        if (!editText.trim() || !editSubtitle.trim() || !editReminder.trim()) {
            toast.error('Please fill in all fields (Title, Memo, and Reminder)');
            return;
        }

        // Calculate display time from reminder
        const [h, m] = editReminder.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour % 12 || 12;
        const newTime = `${displayHour}:${m} ${ampm}`;

        // Check for changes
        const hasChanged =
            editText !== todo.text ||
            editSubtitle !== (todo.subtitle || '') ||
            editPriority !== (todo.priority || 'Low') ||
            editReminder !== (todo.reminder || '') ||
            newTime !== todo.time;

        if (hasChanged) {
            onUpdate(todo.id, {
                text: editText,
                subtitle: editSubtitle,
                priority: editPriority,
                reminder: editReminder,
                time: newTime
            });
            toast.success('Task updated successfully!');
        } else {
            // If nothing changed, just close the editor without a toast
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleUpdate();
        if (e.key === 'Escape') onCancel();
    };

    if (isEditing) {
        return (
            <div className="py-4 border-b border-gray-100 animate-fade-in bg-gray-50/50 px-3 -mx-3 rounded-xl">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        placeholder="Task name"
                        className="text-base font-bold text-black border-b border-gray-200 outline-none py-1 bg-transparent w-full"
                    />
                    <input
                        type="text"
                        value={editSubtitle}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        placeholder="Add memo..."
                        className="text-sm text-gray-500 outline-none bg-transparent w-full"
                    />

                    <div className="flex items-center justify-between gap-4 mt-1">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                <span className="text-xs font-medium text-gray-400">Prio:</span>
                                <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value as any)}
                                    className="text-xs font-bold text-black outline-none bg-transparent cursor-pointer"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white px-1 py-1 rounded-md border border-gray-100">
                                <Bell size={12} className="text-gray-400" />
                                <input
                                    type="time"
                                    value={editReminder}
                                    onChange={(e) => setEditReminder(e.target.value)}
                                    className="text-xs font-bold text-black outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleUpdate}
                                className="p-2 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                                title="Save"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={onCancel}
                                className="p-2 text-gray-500 hover:text-black transition-colors"
                                title="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleDelete = () => {
        toast.warn(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">Delete this task?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                onDelete(todo.id);
                                toast.success('Task deleted successfully');
                                closeToast();
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={handleToggle}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.isCompleted
                        ? 'bg-yellow-400 border-yellow-400'
                        : 'border-gray-200 hover:border-yellow-400'
                        }`}
                >
                    {todo.isCompleted && <div className="text-white text-xs">✓</div>}
                </button>

                <div className="flex flex-col">
                    <span className={`text-base font-bold ${todo.isCompleted ? 'text-gray-300 line-through' : 'text-black'}`}>
                        {todo.text}
                    </span>
                    {(todo.subtitle || todo.priority) && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium">
                                {todo.subtitle}
                            </span>
                            {todo.priority && todo.priority !== 'Low' && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${todo.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {todo.priority}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {todo.time && <span className="text-xs text-black font-bold mr-2">{todo.time}</span>}
                {todo.reminder && <Bell size={16} className="text-gray-300 mr-2" />}

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(todo.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                    >
                        <SquarePen size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
