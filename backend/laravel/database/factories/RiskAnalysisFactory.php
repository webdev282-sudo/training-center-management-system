<?php
namespace Database\Factories;
 
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;
 


class RiskAnalysisFactory extends Factory
{
    protected $model = \App\Models\RiskAnalysis::class;
 
    public function definition(): array
    {
        $absence     = $this->faker->numberBetween(0, 100);
        $payment     = $this->faker->numberBetween(0, 100);
        $progression = $this->faker->numberBetween(0, 100);
        $total       = (int) round(($absence + $payment + $progression) / 3);
 
        return [
            'student_id'        => \App\Models\Student::factory(),
            'absence_score'     => $absence,
            'payment_score'     => $payment,
            'progression_score' => $progression,
            'total_risk_score'  => $total,
            'risk_level'        => $total >= 70 ? 'high' : ($total >= 40 ? 'medium' : 'low'),
            'recommendation'    => 'Recommandation de test.',
        ];
    }
}