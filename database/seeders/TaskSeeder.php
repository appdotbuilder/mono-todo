<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            // Create a default user if none exist
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
            
            // Create sample tasks for the test user
            Task::factory()->count(5)->create([
                'user_id' => $user->id,
            ]);
        } else {
            // Create tasks for existing users
            foreach ($users as $user) {
                Task::factory()->count(fake()->numberBetween(3, 8))->create([
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}