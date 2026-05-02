<?php

namespace Database\Factories;
 
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;
class AttendanceFactory extends Factory
{
    protected $model = \App\Models\Attendance::class;
 
    public function definition(): array
    {
        return [
            'session_id' => Session::factory(),
            'student_id' => \App\Models\Student::factory(),
            'status'     => $this->faker->randomElement(['present', 'absent', 'late', 'excused']),
            'time_in'    => null,
        ];
    }
}