<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_authenticated_user_can_view_tasks_page(): void
    {
        $response = $this->get(route('tasks.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('tasks/index'));
    }

    public function test_user_can_create_task(): void
    {
        $taskData = [
            'description' => 'Test task description',
        ];

        $response = $this->post(route('tasks.store'), $taskData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'description' => 'Test task description',
            'user_id' => auth()->id(),
            'completed' => false,
        ]);
    }

    public function test_user_can_update_task_description(): void
    {
        $task = Task::factory()->create([
            'user_id' => auth()->id(),
            'description' => 'Original description',
        ]);

        $response = $this->patch(route('tasks.update', $task), [
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200);
        $task->refresh();
        $this->assertEquals('Updated description', $task->description);
    }

    public function test_user_can_toggle_task_completion(): void
    {
        $task = Task::factory()->create([
            'user_id' => auth()->id(),
            'completed' => false,
        ]);

        $response = $this->patch(route('tasks.update', $task), [
            'completed' => true,
        ]);

        $response->assertStatus(200);
        $task->refresh();
        $this->assertTrue($task->completed);
    }

    public function test_user_can_delete_task(): void
    {
        $task = Task::factory()->create([
            'user_id' => auth()->id(),
        ]);

        $response = $this->delete(route('tasks.destroy', $task));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_user_cannot_access_other_users_tasks(): void
    {
        $otherUser = User::factory()->create();
        $otherTask = Task::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // Try to update other user's task
        $response = $this->patch(route('tasks.update', $otherTask), [
            'description' => 'Malicious update',
        ]);

        $response->assertStatus(403);

        // Try to delete other user's task
        $response = $this->delete(route('tasks.destroy', $otherTask));

        $response->assertStatus(403);
    }

    public function test_task_description_is_required(): void
    {
        $response = $this->post(route('tasks.store'), [
            'description' => '',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    public function test_task_description_has_max_length(): void
    {
        $response = $this->post(route('tasks.store'), [
            'description' => str_repeat('a', 501), // Exceeds 500 character limit
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    public function test_guest_cannot_access_tasks(): void
    {
        auth()->logout();

        $response = $this->get(route('tasks.index'));
        $response->assertRedirect(route('login'));

        $response = $this->post(route('tasks.store'), [
            'description' => 'Test task',
        ]);
        $response->assertRedirect(route('login'));
    }

    public function test_home_page_redirects_authenticated_users_to_tasks(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('tasks.index'));
    }

    public function test_home_page_shows_welcome_for_guests(): void
    {
        auth()->logout();

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('welcome'));
    }
}