<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = \App\Models\Payment::class;

    public function definition(): array
    {
        $total = $this->faker->randomElement([12000, 18000, 24000]);
        $paid  = $this->faker->numberBetween(0, $total);

        return [
            'student_id'     => \App\Models\Student::factory(),
            'enrollment_id'  => \App\Models\Enrollment::factory(),
            'total_amount'   => $total,
            'paid_amount'    => $paid,
            'payment_status' => $paid === 0 ? 'pending' : ($paid >= $total ? 'paid' : 'partial'),
            'due_date'       => now()->addMonth()->toDateString(),
        ];
    }

    public function overdue(): static
    {
        return $this->state([
            'paid_amount'    => 0,
            'payment_status' => 'overdue',
            'due_date'       => now()->subDays(10)->toDateString(),
        ]);
    }
}