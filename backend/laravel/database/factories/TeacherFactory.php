<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = \App\Models\Teacher::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'phone'     => '0660' . $this->faker->numerify('######'),
            'email'     => $this->faker->unique()->safeEmail(),
            'specialty' => $this->faker->randomElement(['Anglais', 'Informatique', 'Marketing']),
            'status'    => true,
        ];
    }
}