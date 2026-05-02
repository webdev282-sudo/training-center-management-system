<?php
// tests/Feature/Students/StudentCrudTest.php
// ============================================================
namespace Tests\Feature\Students;
 
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class StudentCrudTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_can_list_students_paginated(): void
    {
        $this->actingAsAdmin();
        Student::factory()->count(5)->create();
 
        $response = $this->getJson('/api/v1/students');
 
        $response->assertOk();
        $this->assertPaginatedResponse($response, 5);
        $response->assertJsonStructure([
            'data' => [['id', 'studentCode', 'fullName', 'phone', 'status']],
        ]);
    }
 
    public function test_can_search_students_by_name(): void
    {
        $this->actingAsAdmin();
        Student::factory()->create(['first_name' => 'Kenza', 'last_name' => 'Aït Yahia']);
        Student::factory()->count(3)->create();
 
        $response = $this->getJson('/api/v1/students?search=Kenza');
 
        $response->assertOk();
        $this->assertPaginatedResponse($response, 1);
    }
 
    public function test_can_filter_students_by_status(): void
    {
        $this->actingAsAdmin();
        Student::factory()->count(3)->create(['status' => 'active']);
        Student::factory()->count(2)->archived()->create();
 
        $this->getJson('/api/v1/students?status=active')
             ->assertOk()
             ->assertJsonPath('meta.total', 3);
 
        $this->getJson('/api/v1/students?status=archived')
             ->assertOk()
             ->assertJsonPath('meta.total', 2);
    }
 
    public function test_can_create_student(): void
    {
        $this->actingAsAdmin();
 
        $response = $this->postJson('/api/v1/students', [
            'first_name' => 'Sara',
            'last_name'  => 'Benali',
            'phone'      => '0770123456',
            'email'      => 'sara@test.dz',
        ]);
 
        $response->assertCreated()
                 ->assertJsonPath('data.fullName', 'Sara Benali')
                 ->assertJsonPath('data.status', 'active');
 
        $this->assertDatabaseHas('students', [
            'first_name' => 'Sara',
            'last_name'  => 'Benali',
        ]);
    }
 
    public function test_create_student_validates_required_fields(): void
    {
        $this->actingAsAdmin();
 
        $this->postJson('/api/v1/students', [])
             ->assertUnprocessable()
             ->assertJsonValidationErrors(['first_name', 'last_name', 'phone']);
    }
 
    public function test_create_student_rejects_duplicate_email(): void
    {
        $this->actingAsAdmin();
        Student::factory()->create(['email' => 'existing@test.dz']);
 
        $this->postJson('/api/v1/students', [
            'first_name' => 'Other',
            'last_name'  => 'Student',
            'phone'      => '0660000000',
            'email'      => 'existing@test.dz',
        ])->assertUnprocessable()
          ->assertJsonValidationErrors(['email']);
    }
 
    public function test_can_show_student_with_relations(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
 
        $this->getJson("/api/v1/students/{$student->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $student->id)
             ->assertJsonStructure(['data' => ['id', 'studentCode', 'fullName', 'activeGroups', 'riskAnalysis']]);
    }
 
    public function test_can_update_student(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
 
        $this->putJson("/api/v1/students/{$student->id}", [
            'first_name' => 'Updated',
            'last_name'  => $student->last_name,
            'phone'      => $student->phone,
        ])->assertOk()
          ->assertJsonPath('data.firstName', 'Updated');
    }
 
    public function test_can_archive_student(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create(['status' => 'active']);
 
        $this->patchJson("/api/v1/students/{$student->id}/archive")
             ->assertOk()
             ->assertJsonPath('data.status', 'archived');
 
        $this->assertDatabaseHas('students', [
            'id'     => $student->id,
            'status' => 'archived',
        ]);
    }
 
    public function test_returns_404_for_unknown_student(): void
    {
        $this->actingAsAdmin();
 
        $this->getJson('/api/v1/students/9999')
             ->assertNotFound()
             ->assertJsonStructure(['errors']);
    }
}