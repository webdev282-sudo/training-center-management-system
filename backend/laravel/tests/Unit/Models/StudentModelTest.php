<?php
namespace Tests\Unit\Models;
 
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class StudentModelTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_full_name_accessor(): void
    {
        $student = Student::factory()->make([
            'first_name' => 'Kenza',
            'last_name'  => 'Aït Yahia',
        ]);
 
        $this->assertEquals('Kenza Aït Yahia', $student->full_name);
    }
 
    public function test_active_scope_returns_only_active_students(): void
    {
        Student::factory()->count(3)->create(['status' => 'active']);
        Student::factory()->count(2)->archived()->create();
 
        $this->assertCount(3, Student::active()->get());
    }
 
    public function test_archived_scope_returns_only_archived_students(): void
    {
        Student::factory()->count(2)->create(['status' => 'active']);
        Student::factory()->count(4)->archived()->create();
 
        $this->assertCount(4, Student::archived()->get());
    }
}