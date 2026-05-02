<?php

namespace Database\Factories;
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;



class CourseFactory extends Factory
{
    protected $model = \App\Models\Course::class;

    public function definition(): array
    {
        return [
            'domain_id'      => \App\Models\Domain::factory(),
            'title'          => $this->faker->sentence(3),
            'duration'       => $this->faker->randomElement(['2 mois', '3 mois', '6 mois']),
            'sessions_count' => $this->faker->numberBetween(12, 60),
            'price'          => $this->faker->randomElement([12000, 18000, 24000, 32000]),
            'level'          => $this->faker->randomElement(['débutant', 'intermédiaire', 'avancé']),
            'status'         => true,
        ];
    }
}