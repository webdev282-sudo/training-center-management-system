<?php
namespace Database\Factories;
 
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
 
class AdminFactory extends Factory
{
    protected $model = Admin::class;
 
    public function definition(): array
    {
        return [
            'name'     => $this->faker->name(),
            'email'    => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ];
    }
 
    public function superAdmin(): static
    {
        return $this->state(['role' => 'super_admin']);
    }
}