import React, { useState } from 'react';
import { Bell, Flag } from 'lucide-react';
import { toast } from 'react-toastify';

interface AddTodoScreenProps {
    onAdd: (text: string, subtitle?: string, time?: string, priority?: 'Low' | 'Medium' | 'High', reminder?: string) => void;
    onCancel: () => void;
}

export const AddTodoScreen: React.FC<AddTodoScreenProps> = ({ onAdd, onCancel }) => {
    const [text, setText] = useState('');
    const [memo, setMemo] = useState('');

    // Options State
    const [reminder, setReminder] = useState<string>('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');

    const handleAdd = () => {
        if (!text.trim()) {
            toast.error('Please enter a task title');
            return;
        }

        if (!memo.trim()) {
            toast.error('Please add a memo/subtitle');
            return;
        }

        let finalReminder = reminder;

        // If reminder is empty, set it to 1 hour from now
        if (!finalReminder) {
            const now = new Date();
            now.setHours(now.getHours() + 1);
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            finalReminder = `${hrs}:${mins}`;
        }

        const [h, m] = finalReminder.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour}:${m} ${ampm}`;

        onAdd(text, memo, displayTime, priority, finalReminder);
        toast.success('Task added successfully!');
    };

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white z-10">
                <button onClick={onCancel} className="text-gray-500 text-lg hover:text-black">Cancel</button>
                <button onClick={handleAdd} className="text-black font-bold text-lg hover:opacity-70">Add task</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Input Area */}
                <div className="px-6 mt-2 space-y-4">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your task"
                        className="w-full text-3xl text-black placeholder-gray-300 outline-none font-bold"
                        autoFocus
                    />
                    <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="Add a memo..."
                        className="w-full text-lg text-gray-600 placeholder-gray-300 outline-none resize-none"
                        rows={2}
                    />
                </div>

                {/* Options List */}
                <div className="mt-8 px-6 space-y-1">

                    <div className="flex items-center justify-between py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-gray-400" />
                            <span className="text-lg font-medium text-black">Reminder</span>
                        </div>
                        <input
                            type="time"
                            value={reminder}
                            onChange={(e) => setReminder(e.target.value)}
                            className="text-right text-gray-400 outline-none bg-transparent cursor-pointer font-bold"
                        />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <Flag size={20} className="text-gray-400" />
                            <span className="text-lg font-medium text-black">Priority</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="text-sm font-bold text-black outline-none bg-transparent appearance-none cursor-pointer"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
