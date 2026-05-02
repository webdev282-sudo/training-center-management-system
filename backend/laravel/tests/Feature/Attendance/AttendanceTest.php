<?php
// tests/Feature/Attendance/AttendanceTest.php
// ============================================================
namespace Tests\Feature\Attendance;
 
use App\Models\{Student, Group, Session, Enrollment, Attendance};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class AttendanceTest extends TestCase
{
    use RefreshDatabase;
 
    private function createSession(): array
    {
        $group   = Group::factory()->create();
        $student = Student::factory()->create();
        Enrollment::factory()->create(['student_id' => $student->id, 'group_id' => $group->id]);
        $session = Session::factory()->create(['group_id' => $group->id, 'teacher_id' => $group->teacher_id]);
 
        return compact('group', 'student', 'session');
    }
 
    public function test_can_bulk_record_attendance(): void
    {
        $this->actingAsAdmin();
        ['student' => $student, 'session' => $session] = $this->createSession();
 
        $response = $this->postJson('/api/v1/attendance/bulk', [
            'session_id' => $session->id,
            'records'    => [
                [
                    'student_id' => $student->id,
                    'status'     => 'present',
                    'time_in'    => '08:05',
                ],
            ],
        ]);
 
        $response->assertOk();
 
        $this->assertDatabaseHas('attendances', [
            'session_id' => $session->id,
            'student_id' => $student->id,
            'status'     => 'present',
            'time_in'    => '08:05',
        ]);
 
        // Session marked as completed
        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'completed',
        ]);
    }
 
    public function test_bulk_record_is_idempotent(): void
    {
        $this->actingAsAdmin();
        ['student' => $student, 'session' => $session] = $this->createSession();
 
        $payload = [
            'session_id' => $session->id,
            'records'    => [['student_id' => $student->id, 'status' => 'present']],
        ];
 
        $this->postJson('/api/v1/attendance/bulk', $payload)->assertOk();
        $this->postJson('/api/v1/attendance/bulk', $payload)->assertOk();
 
        // Only one record, not duplicated
        $this->assertDatabaseCount('attendances', 1);
    }
 
    public function test_can_get_attendance_for_session(): void
    {
        $this->actingAsAdmin();
        ['student' => $student, 'session' => $session] = $this->createSession();
 
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $student->id,
            'status'     => 'absent',
        ]);
 
        $this->getJson("/api/v1/attendance?session_id={$session->id}")
             ->assertOk()
             ->assertJsonCount(1, 'data');
    }
 
    public function test_bulk_record_validates_status_values(): void
    {
        $this->actingAsAdmin();
        ['student' => $student, 'session' => $session] = $this->createSession();
 
        $this->postJson('/api/v1/attendance/bulk', [
            'session_id' => $session->id,
            'records'    => [['student_id' => $student->id, 'status' => 'invalid_status']],
        ])->assertUnprocessable()
          ->assertJsonValidationErrors(['records.0.status']);
    }
}