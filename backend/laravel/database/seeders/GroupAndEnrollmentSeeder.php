<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Course, Teacher, Student, Group, Enrollment, Payment, Installment};

class GroupAndEnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $anglais   = Course::where('title', 'Anglais B2')->first();
        $info      = Course::where('title', 'Informatique Bureautique')->first();
        $marketing = Course::where('title', 'Marketing Digital')->first();

        $t1 = Teacher::where('specialty', 'Anglais')->first();
        $t2 = Teacher::where('specialty', 'Informatique')->first();
        $t3 = Teacher::where('specialty', 'Marketing')->first();

       $groups = [
            Group::create([
                'course_id'  => $anglais->id,   'teacher_id' => $t1->id,
                'name'       => 'Anglais B2 - G1',
                'room'       => 'Salle A',       'start_date' => now()->subMonth(),
                'end_date'   => now()->addMonths(2),
                'days'       => ['lundi', 'mercredi', 'vendredi'],
                'start_time' => '08:00',         'end_time'  => '10:00',
                'capacity'   => 20,              'status'    => 'active',
            ]),
            Group::create([
                'course_id'  => $info->id,       'teacher_id' => $t2->id,
                'name'       => 'Informatique - G1',
                'room'       => 'Salle B',        'start_date' => now()->subWeeks(3),
                'end_date'   => now()->addMonths(3),
                'days'       => ['mardi', 'jeudi'],
                'start_time' => '10:00',          'end_time'  => '12:00',
                'capacity'   => 15,               'status'    => 'active',
            ]),
            Group::create([
                'course_id'  => $marketing->id,  'teacher_id' => $t3->id,
                'name'       => 'Marketing - G1',
                'room'       => 'Salle C',        'start_date' => now()->subWeeks(2),
                'end_date'   => now()->addMonths(4),
                'days'       => ['mardi', 'jeudi', 'samedi'],
                'start_time' => '14:00',          'end_time'  => '16:00',
                'capacity'   => 20,               'status'    => 'active',
            ]),
        ];
 
        // Enroll students and create payments
        $students = Student::all();
 
        foreach ($students->take(8) as $i => $student) {
            $group = $groups[$i % count($groups)];
 
            $enrollment = Enrollment::create([
                'student_id'      => $student->id,
                'group_id'        => $group->id,
                'enrollment_date' => now()->subDays(rand(5, 30))->toDateString(),
                'status'          => 'active',
            ]);
 
            $payment = Payment::create([
                'student_id'     => $student->id,
                'enrollment_id'  => $enrollment->id,
                'total_amount'   => $group->course->price,
                'paid_amount'    => 0,
                'payment_status' => 'pending',
                'due_date'       => now()->addDays(rand(-5, 30))->toDateString(),
            ]);
 
            // Add a cash installment for some students
            if ($i % 2 === 0) {
                Installment::create([
                    'payment_id' => $payment->id,
                    'amount'     => $group->course->price / 2,
                    'due_date'   => now()->subDays(5)->toDateString(),
                    'paid_date'  => now()->subDays(3)->toDateString(),
                    'status'     => 'paid',
                    'method'     => 'cash',
                ]);
            }
        }
    }
}