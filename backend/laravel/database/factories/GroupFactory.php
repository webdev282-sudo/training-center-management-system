<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    protected $model = \App\Models\Group::class;

    public function definition(): array
    {
        return [
            'course_id'  => \App\Models\Course::factory(),
            'teacher_id' => \App\Models\Teacher::factory(),
            'name'       => 'Groupe ' . $this->faker->randomLetter() . $this->faker->numberBetween(1, 9),
            'room'       => 'Salle ' . $this->faker->randomElement(['A', 'B', 'C']),
            'start_date' => now()->subMonth()->toDateString(),
            'end_date'   => now()->addMonths(2)->toDateString(),
            'days'       => ['lundi', 'mercredi'],
            'start_time' => '09:00',
            'end_time'   => '11:00',
            'capacity'   => 20,
            'status'     => 'active',
        ];
    }
}