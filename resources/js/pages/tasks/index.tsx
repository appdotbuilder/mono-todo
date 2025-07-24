import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';
import { Trash2, Edit, Check, X } from 'lucide-react';

interface Task {
    id: number;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    tasks: Task[];
    [key: string]: unknown;
}

export default function TasksIndex({ tasks }: Props) {
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState<number | null>(null);
    const [editDescription, setEditDescription] = useState('');

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        router.post(route('tasks.store'), {
            description: newTask
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setNewTask('');
            }
        });
    };

    const handleToggleComplete = (task: Task) => {
        router.patch(route('tasks.update', task.id), {
            completed: !task.completed
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDeleteTask = (task: Task) => {
        router.delete(route('tasks.destroy', task.id), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task.id);
        setEditDescription(task.description);
    };

    const handleSaveEdit = (task: Task) => {
        if (!editDescription.trim()) return;

        router.patch(route('tasks.update', task.id), {
            description: editDescription
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingTask(null);
                setEditDescription('');
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditDescription('');
    };

    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <AppLayout>
            <div className="min-h-screen bg-white">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-light text-black mb-2">Tasks</h1>
                        <p className="text-gray-600 text-sm">Stay organized with your minimalist to-do list</p>
                    </div>

                    {/* Add new task form */}
                    <form onSubmit={handleCreateTask} className="mb-8">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 border-gray-300 focus:border-black focus:ring-black"
                            />
                            <Button 
                                type="submit" 
                                className="bg-black text-white hover:bg-gray-800 border-black"
                            >
                                Add
                            </Button>
                        </div>
                    </form>

                    {/* Task Lists */}
                    <div className="space-y-8">
                        {/* Incomplete Tasks */}
                        {incompleteTasks.length > 0 && (
                            <div>
                                <h2 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">
                                    To Do ({incompleteTasks.length})
                                </h2>
                                <div className="space-y-2">
                                    {incompleteTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
                                        >
                                            <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={() => handleToggleComplete(task)}
                                                className="border-gray-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
                                            />
                                            
                                            {editingTask === task.id ? (
                                                <div className="flex-1 flex items-center gap-2">
                                                    <Input
                                                        type="text"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="flex-1 border-gray-300 focus:border-black focus:ring-black text-sm"
                                                        autoFocus
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveEdit(task)}
                                                        className="bg-black text-white hover:bg-gray-800 p-1 h-8 w-8"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleCancelEdit}
                                                        className="border-gray-300 hover:bg-gray-50 p-1 h-8 w-8"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="flex-1 text-black text-sm">
                                                        {task.description}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleEditTask(task)}
                                                            className="text-gray-400 hover:text-black hover:bg-gray-100 p-1 h-8 w-8"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteTask(task)}
                                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 h-8 w-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed Tasks */}
                        {completedTasks.length > 0 && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-600 mb-4 border-b border-gray-200 pb-2">
                                    Completed ({completedTasks.length})
                                </h2>
                                <div className="space-y-2">
                                    {completedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors opacity-75"
                                        >
                                            <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={() => handleToggleComplete(task)}
                                                className="border-gray-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
                                            />
                                            <span className="flex-1 text-gray-500 text-sm line-through">
                                                {task.description}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteTask(task)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 h-8 w-8"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {tasks.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-1">No tasks yet</h3>
                                <p className="text-sm text-gray-400">Add your first task to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}