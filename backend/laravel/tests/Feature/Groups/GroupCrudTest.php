<?php
namespace Tests\Feature\Groups;
 
use App\Models\{Group, Course, Teacher};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class GroupCrudTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_can_list_groups(): void
    {
        $this->actingAsAdmin();
        Group::factory()->count(3)->create();
 
        $this->getJson('/api/v1/groups')
             ->assertOk()
             ->assertJsonStructure(['data', 'meta']);
    }
 
    public function test_can_create_group(): void
    {
        $this->actingAsAdmin();
        $course  = Course::factory()->create();
        $teacher = Teacher::factory()->create();
 
        $response = $this->postJson('/api/v1/groups', [
            'course_id'  => $course->id,
            'teacher_id' => $teacher->id,
            'name'       => 'Anglais B2 - G1',
            'room'       => 'Salle A',
            'start_date' => now()->toDateString(),
            'end_date'   => now()->addMonths(3)->toDateString(),
            'days'       => ['lundi', 'mercredi'],
            'start_time' => '09:00',
            'end_time'   => '11:00',
            'capacity'   => 20,
        ]);
 
        $response->assertCreated()
                 ->assertJsonPath('data.name', 'Anglais B2 - G1')
                 ->assertJsonPath('data.status', 'active');
    }
 
    public function test_can_complete_a_group(): void
    {
        $this->actingAsAdmin();
        $group = Group::factory()->create(['status' => 'active']);
 
        $this->patchJson("/api/v1/groups/{$group->id}/complete")
             ->assertOk()
             ->assertJsonPath('data.status', 'completed');
 
        $this->assertDatabaseHas('groups', ['id' => $group->id, 'status' => 'completed']);
    }
 
    public function test_create_group_validates_end_date_after_start_date(): void
    {
        $this->actingAsAdmin();
        $course  = Course::factory()->create();
        $teacher = Teacher::factory()->create();
 
        $this->postJson('/api/v1/groups', [
            'course_id'  => $course->id,
            'teacher_id' => $teacher->id,
            'name'       => 'Test Group',
            'start_date' => '2025-06-01',
            'end_date'   => '2025-05-01', // before start_date
            'days'       => ['lundi'],
            'start_time' => '09:00',
            'end_time'   => '11:00',
            'capacity'   => 20,
        ])->assertUnprocessable()
          ->assertJsonValidationErrors(['end_date']);
    }
}