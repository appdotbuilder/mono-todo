<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = auth()->user()->tasks()
            ->orderBy('completed', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('tasks/index', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        auth()->user()->tasks()->create($request->validated());

        $tasks = auth()->user()->tasks()
            ->orderBy('completed', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Ensure user can only update their own tasks
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $task->update($request->validated());

        $tasks = auth()->user()->tasks()
            ->orderBy('completed', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Ensure user can only delete their own tasks
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }
        
        $task->delete();

        $tasks = auth()->user()->tasks()
            ->orderBy('completed', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks
        ]);
    }
}