<?php
namespace Database\Factories;
 
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
 class StudentFactory extends Factory
{
    protected $model = \App\Models\Student::class;
 
    private static int $counter = 1;
 
    public function definition(): array
    {
        return [
            'student_code'     => sprintf('STU-%d-%04d', now()->year, self::$counter++),
            'first_name'       => $this->faker->firstName(),
            'last_name'        => $this->faker->lastName(),
            'gender'           => $this->faker->randomElement(['M', 'F']),
            'phone'            => '077' . $this->faker->numerify('#######'),
            'email'            => $this->faker->unique()->safeEmail(),
            'registration_date'=> now()->toDateString(),
            'status'           => 'active',
        ];
    }
 
    public function archived(): static
    {
        return $this->state(['status' => 'archived', 'archived_at' => now()]);
    }
}