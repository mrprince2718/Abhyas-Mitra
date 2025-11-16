import React, { useState, useMemo } from 'react';
import { TodoListState } from '../types';
import { XCircleIcon, ClipboardCheckIcon, SparkleIcon } from './icons';

interface TodoListModalProps {
    todoListState: TodoListState;
    isLoading: boolean;
    onGenerate: (rawInput: string) => void;
    onToggleItem: (itemIndex: number) => void;
    onClose: () => void;
}

const TodoInput: React.FC<{ onGenerate: (rawInput: string) => void; isLoading: boolean; }> = ({ onGenerate, isLoading }) => {
    const [rawInput, setRawInput] = useState('');

    const handleGenerate = () => {
        if (rawInput.trim()) {
            onGenerate(rawInput);
        }
    };
    
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-content-secondary block mb-2">What are your study goals for today?</label>
                <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    rows={4}
                    placeholder="e.g., Read chapter 3 of chemistry, finish my math homework, and prepare for the history test..."
                    className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={!rawInput.trim() || isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? 'Generating...' : 'Generate Plan'}
            </button>
        </div>
    );
};

const ActiveTodoList: React.FC<{ 
    todoListState: TodoListState; 
    onToggleItem: (itemIndex: number) => void;
}> = ({ todoListState, onToggleItem }) => {
    const { items, suggestion } = todoListState;
    const completedCount = useMemo(() => items.filter(item => item.isDone).length, [items]);
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg mb-6">
                <p className="text-sm text-primary/90"><strong className="font-semibold">Suggestion:</strong> {suggestion}</p>
            </div>

            <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-content-secondary">
                    Your Tasks
                </div>
                <div className="text-sm font-bold text-content">{completedCount} / {items.length} Completed</div>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {items.map((item, index) => (
                    <label key={index} className="flex items-center p-3 bg-base-300/50 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                        <input
                            type="checkbox"
                            checked={item.isDone}
                            onChange={() => onToggleItem(index)}
                            className="w-5 h-5 rounded bg-base-100 border-base-300 text-primary focus:ring-primary"
                        />
                        <span className={`ml-3 ${item.isDone ? 'line-through text-content-secondary' : 'text-content'}`}>
                            {item.task}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};


export const TodoListModal: React.FC<TodoListModalProps> = ({ todoListState, isLoading, onGenerate, onToggleItem, onClose }) => {
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-base-200 rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ClipboardCheckIcon className="w-6 h-6 text-primary" />
                        <h2 className="text-lg font-bold">Daily Study Goals</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-content-secondary hover:text-content">
                        <XCircleIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {todoListState.status === 'input' && <TodoInput onGenerate={onGenerate} isLoading={isLoading} />}
                    {todoListState.status === 'loading' && (
                        <div className="text-center py-10">
                            <SparkleIcon className="w-12 h-12 text-primary mx-auto animate-pulse" />
                            <p className="mt-4 text-lg font-medium">Generating your plan...</p>
                            <p className="text-content-secondary">This might take a moment.</p>
                        </div>
                    )}
                    {todoListState.status === 'active' && <ActiveTodoList todoListState={todoListState} onToggleItem={onToggleItem} />}
                </div>
            </div>
        </div>
    );
};