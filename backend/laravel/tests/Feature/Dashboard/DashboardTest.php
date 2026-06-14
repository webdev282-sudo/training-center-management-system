<?php

namespace Tests\Feature\Dashboard;
 
use App\Models\{Student, Group, Payment, Enrollment};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class DashboardTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_kpis_return_correct_structure(): void
    {
        $this->actingAsAdmin();
 
        $this->getJson('/api/v1/dashboard/kpis')
             ->assertOk()
             ->assertJsonStructure([
                 'data' => [
                     'activeStudents',
                     'activeCourses',
                     'activeGroups',
                     'overduePayments',
                     'avgAttendanceRate',
                     'atRiskStudents',
                 ],
             ]);
    }
 
    public function test_kpis_count_active_students_correctly(): void
    {
        $this->actingAsAdmin();
        Student::factory()->count(4)->create(['status' => 'active']);
        Student::factory()->count(2)->archived()->create();
 
        $this->getJson('/api/v1/dashboard/kpis')
             ->assertOk()
             ->assertJsonPath('data.activeStudents', 4);
    }
 
    public function test_kpis_count_overdue_payments_correctly(): void
    {
        $this->actingAsAdmin();
 
        $enrollment1 = Enrollment::factory()->create();
        $enrollment2 = Enrollment::factory()->create();
 
        Payment::factory()->overdue()->create([
            'student_id'    => $enrollment1->student_id,
            'enrollment_id' => $enrollment1->id,
        ]);
        Payment::factory()->overdue()->create([
            'student_id'    => $enrollment2->student_id,
            'enrollment_id' => $enrollment2->id,
        ]);
 
        $this->getJson('/api/v1/dashboard/kpis')
             ->assertOk()
             ->assertJsonPath('data.overduePayments', 2);
    }
 
    public function test_overdue_payments_list_returns_correct_structure(): void
    {
        $this->actingAsAdmin();
 
        $this->getJson('/api/v1/dashboard/overdue-payments')
             ->assertOk()
             ->assertJsonStructure(['data']);
    }
}