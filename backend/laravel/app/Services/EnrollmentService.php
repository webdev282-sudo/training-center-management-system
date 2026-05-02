<?php

namespace App\Services;

use App\Models\{Enrollment, Payment, Group, Student};
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    public function enroll(Student $student, Group $group): Enrollment
    {
        if ($group->available_slots <= 0) {
            throw new \RuntimeException("Le groupe {$group->name} est complet.");
        }

        return DB::transaction(function () use ($student, $group) {
            $enrollment = Enrollment::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'group_id' => $group->id,
                ],
                [
                    'enrollment_date' => today(),
                    'status' => 'active',
                ]
            );

            Payment::firstOrCreate(
                [
                    'enrollment_id' => $enrollment->id,
                ],
                [
                    'student_id' => $student->id,
                    'total_amount' => $group->course->price ?? 0,
                    'paid_amount' => 0,
                    'payment_status' => 'pending',
                    'due_date' => today()->addMonth(),
                ]
            );

            return $enrollment;
        });
    }
}