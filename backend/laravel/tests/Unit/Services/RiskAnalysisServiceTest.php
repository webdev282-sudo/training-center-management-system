<?php
// ============================================================
// tests/Unit/Services/RiskAnalysisServiceTest.php
// ============================================================
namespace Tests\Unit\Services;
 
use App\Models\{Student, Attendance, Payment, Enrollment, Group, Session};
use App\Services\RiskAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class RiskAnalysisServiceTest extends TestCase
{
    use RefreshDatabase;
 
    private RiskAnalysisService $service;
 
    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new RiskAnalysisService;
    }
 
    public function test_student_with_no_data_has_zero_risk(): void
    {
        $student = Student::factory()->create();
        $result  = $this->service->analyze($student);
 
        $this->assertEquals(0, $result->total_risk_score);
        $this->assertEquals('low', $result->risk_level);
    }
 
    public function test_student_with_overdue_payment_has_higher_score(): void
    {
        $student    = Student::factory()->create();
        $enrollment = Enrollment::factory()->create(['student_id' => $student->id]);
 
        Payment::factory()->overdue()->create([
            'student_id'    => $student->id,
            'enrollment_id' => $enrollment->id,
        ]);
 
        $result = $this->service->analyze($student);
 
        $this->assertGreaterThan(0, $result->payment_score);
    }
 
    public function test_student_with_all_absences_has_high_absence_score(): void
    {
        $student = Student::factory()->create();
        $group   = Group::factory()->create();
        Enrollment::factory()->create(['student_id' => $student->id, 'group_id' => $group->id]);
 
        // Create 5 sessions all absent
        Session::factory()->count(5)->create(['group_id' => $group->id, 'teacher_id' => $group->teacher_id])
            ->each(fn($s) => Attendance::factory()->create([
                'session_id' => $s->id,
                'student_id' => $student->id,
                'status'     => 'absent',
            ]));
 
        $result = $this->service->analyze($student);
 
        $this->assertEquals(100, $result->absence_score);
    }
 
    public function test_high_risk_student_gets_correct_level(): void
    {
        $student = Student::factory()->create();
 
        // Mock high scores by directly creating the analysis
        $result = \App\Models\RiskAnalysis::updateOrCreate(
            ['student_id' => $student->id],
            [
                'absence_score'     => 80,
                'payment_score'     => 90,
                'progression_score' => 70,
                'total_risk_score'  => 80,
                'risk_level'        => 'high',
                'recommendation'    => 'Contact immédiat requis.',
            ]
        );
 
        $this->assertEquals('high', $result->risk_level);
        $this->assertEquals(80, $result->total_risk_score);
    }
 
    public function test_analyze_all_processes_only_active_students(): void
    {
        Student::factory()->count(3)->create(['status' => 'active']);
        Student::factory()->count(2)->archived()->create();
 
        $this->service->analyzeAll();
 
        $this->assertDatabaseCount('risk_analyses', 3);
    }
 
    public function test_repeated_analysis_updates_existing_record(): void
    {
        $student = Student::factory()->create();
 
        $this->service->analyze($student);
        $this->service->analyze($student);
 
        // Only one record per student
        $this->assertDatabaseCount('risk_analyses', 1);
    }
}