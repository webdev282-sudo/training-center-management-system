<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = \App\Models\Enrollment::class;

    public function definition(): array
    {
        return [
            'student_id'      => \App\Models\Student::factory(),
            'group_id'        => \App\Models\Group::factory(),
            'enrollment_date' => now()->toDateString(),
            'status'          => 'active',
        ];
    }
}