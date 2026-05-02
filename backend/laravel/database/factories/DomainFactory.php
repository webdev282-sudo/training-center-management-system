<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DomainFactory extends Factory
{
    protected $model = \App\Models\Domain::class;

    public function definition(): array
    {
        return [
            'name'   => $this->faker->unique()->word(),
            'status' => true,
        ];
    }
}