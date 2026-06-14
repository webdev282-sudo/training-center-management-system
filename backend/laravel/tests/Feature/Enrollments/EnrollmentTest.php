<?php

namespace Tests\Feature\Enrollments;
 
use App\Models\{Student, Group, Enrollment, Payment};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class EnrollmentTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_can_enroll_student_in_group(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
        $group   = Group::factory()->create(['capacity' => 20]);
 
        $response = $this->postJson('/api/v1/enrollments', [
            'student_id' => $student->id,
            'group_id'   => $group->id,
        ]);
 
        $response->assertCreated();
 
        // Enrollment created
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'group_id'   => $group->id,
            'status'     => 'active',
        ]);
 
        // Payment auto-created with correct amount
        $this->assertDatabaseHas('payments', [
            'student_id'     => $student->id,
            'total_amount'   => $group->course->price,
            'paid_amount'    => 0,
            'payment_status' => 'pending',
        ]);
    }
 
    public function test_cannot_enroll_student_twice_in_same_group(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
        $group   = Group::factory()->create();
 
        // First enrollment
        Enrollment::factory()->create([
            'student_id' => $student->id,
            'group_id'   => $group->id,
        ]);
 
        // Second attempt should fail
        $this->postJson('/api/v1/enrollments', [
            'student_id' => $student->id,
            'group_id'   => $group->id,
        ])->assertStatus(422); // unique constraint violation
    }
 
    public function test_cannot_enroll_in_full_group(): void
    {
        $this->actingAsAdmin();
        $group = Group::factory()->create(['capacity' => 1]);
 
        // Fill the group
        $first = Student::factory()->create();
        Enrollment::factory()->create([
            'student_id' => $first->id,
            'group_id'   => $group->id,
            'status'     => 'active',
        ]);
 
        $second = Student::factory()->create();
 
        $this->postJson('/api/v1/enrollments', [
            'student_id' => $second->id,
            'group_id'   => $group->id,
        ])->assertUnprocessable()
          ->assertJsonStructure(['errors']);
    }
}