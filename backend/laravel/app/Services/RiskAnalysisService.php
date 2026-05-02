<?php

namespace App\Services;

use App\Models\Student;
use App\Models\RiskAnalysis;
class RiskAnalysisService
{
    public function analyze(Student $student): RiskAnalysis
    {
        $absenceScore = $this->absenceScore($student);
        $paymentScore = $this->paymentScore($student);
        $progressionScore = $this->progressionScore($student);

        $total = (int) round(($absenceScore + $paymentScore + $progressionScore) / 3);
        $level = match (true) {
            $total >= 70 => 'high',
            $total >= 40 => 'medium',
            default => 'low',
        };

        return RiskAnalysis::updateOrCreate(
            ['student_id' => $student->id],
            [
                'absence_score'     => $absenceScore,
                'payment_score'     => $paymentScore,
                'progression_score' => $progressionScore,
                'total_risk_score'  => $total,
                'risk_level'        => $level,
                'recommendation'    => $this->recommendation($level),
            ]
        );
    }
    public function analyzeAll(): void
    {
        Student::active()->get()->each(fn ($student) => $this->analyze($student));
    }

    private function absenceScore(Student $student): int
    {
        $total = $student->attendance()->count();
        $absent = $student->attendance()->where('status', 'absent')->count();

        return $total > 0 ? (int) round(($absent / $total) * 100) : 0;
    }

    private function paymentScore(Student $student): int
    {
        $payment = $student->payments()->latest()->first();

        if (!$payment) {
            return 0;
        }

        return match ($payment->payment_status) {
            'paid' => 0,
            'pending' => 20,
            'partial' => 50,
            'overdue' => 90,
            default => 0,
        };
    }

    private function progressionScore(Student $student): int
    {
        $group = $student->activeGroups()->with('sessions')->first();

        if (!$group) {
            return 0;
        }

        $total = $group->sessions()->count();
        $completed = $group->sessions()
            ->where('status', 'completed')
            ->count();

        return $total > 0 ? (int) round((1 - $completed / $total) * 50) : 0;
    }

    private function recommendation(string $level): string
    {
        return match ($level) {
            'high' => 'Contact immédiat requis. Risque élevé d\'abandon.',
            'medium' => 'Suivi recommandé cette semaine.',
            default => 'Étudiant en bonne progression.',
        };
    }
}