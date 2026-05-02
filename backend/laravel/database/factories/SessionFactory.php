<?php
namespace Database\Factories;
 
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;
 
class SessionFactory extends Factory
{
    protected $model = Session::class;
 
    public function definition(): array
    {
        return [
            'group_id'     => \App\Models\Group::factory(),
            'teacher_id'   => \App\Models\Teacher::factory(),
            'session_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'start_time'   => '09:00',
            'end_time'     => '11:00',
            'lesson_order' => $this->faker->numberBetween(1, 30),
            'status'       => 'scheduled',
        ];
    }
 
    public function completed(): static
    {
        return $this->state(['status' => 'completed']);
    }
}