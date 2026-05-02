<?php

namespace App\Services;

use App\Models\Attendance;

class AttendanceService
{
    public function record(int $sessionId, array $records): void
    {
        $upsertData = array_map(fn($r) => [
            'session_id' => $sessionId,
            'student_id' => $r['student_id'],
            'status' => $r['status'],
            'time_in' => $r['time_in'] ?? null,
            'time_out' => $r['time_out'] ?? null,
            'note' => $r['note'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ], $records);

        Attendance::upsert(
            $upsertData,
            ['session_id', 'student_id'],
            ['status', 'time_in', 'time_out', 'note', 'updated_at']
        );
    }

    public function studentRate(int $studentId): float
    {
        $total = Attendance::where('student_id', $studentId)->count();
        $present = Attendance::where('student_id', $studentId)
            ->whereIn('status', ['present', 'late'])
            ->count();

        return $total > 0 ? round(($present / $total) * 100, 1) : 0.0;
    }
}