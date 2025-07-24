<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - redirect to tasks for authenticated users, welcome for guests
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('tasks.index');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Task routes - main functionality
    Route::controller(TaskController::class)->group(function () {
        Route::get('/tasks', 'index')->name('tasks.index');
        Route::post('/tasks', 'store')->name('tasks.store');
        Route::patch('/tasks/{task}', 'update')->name('tasks.update');
        Route::delete('/tasks/{task}', 'destroy')->name('tasks.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
