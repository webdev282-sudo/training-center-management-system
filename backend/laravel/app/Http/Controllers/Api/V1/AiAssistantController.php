<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\{
    AiAssistantQuery,
    Student,
    Payment,
    Group,
    Attendance,
    RiskAnalysis
};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiAssistantController extends Controller
{
    public function ask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|min:3|max:500',
        ]);

        $q = mb_strtolower($validated['question']);
        $answer = "Je n'ai pas compris la question. Essayez par exemple : nombre d'étudiants, paiements en retard, absences, groupes actifs.";

        if ($this->hasAny($q, ['étudiant', 'étudiants', 'student', 'students', 'élève', 'élèves', 'طالب', 'طلبة', 'طلاب'])) {
            $active = Student::where('status', 'active')->count();
            $archived = Student::where('status', 'archived')->count();
            $answer = "Il y a {$active} étudiants actifs et {$archived} étudiants archivés.";
        }

        elseif ($this->hasAny($q, ['groupe', 'groupes', 'group', 'groups', 'فوج', 'افواج', 'أفواج'])) {
            $active = Group::where('status', 'active')->count();
            $completed = Group::where('status', 'completed')->count();
            $answer = "Il y a {$active} groupes actifs et {$completed} groupes terminés.";
        }

        elseif ($this->hasAny($q, ['paiement', 'paiements', 'payment', 'payments', 'دفع', 'دفعات', 'paiement partiel', 'partiel', 'partial'])) {
            $paid = Payment::where('payment_status', 'paid')->count();
            $partial = Payment::where('payment_status', 'partial')->count();
            $pending = Payment::where('payment_status', 'pending')->count();
            $overdue = Payment::where('payment_status', 'overdue')->count();

            $answer = "Résumé des paiements : {$paid} payés, {$partial} partiels, {$pending} en attente, {$overdue} en retard.";
        }

        elseif ($this->hasAny($q, ['retard', 'overdue', 'dette', 'dettes', 'ديون', 'متأخر'])) {
            $count = Payment::where('payment_status', 'overdue')->count();

            $list = Payment::with('student')
                ->where('payment_status', 'overdue')
                ->orderByDesc('remaining_amount')
                ->limit(5)
                ->get()
                ->map(fn ($p) => optional($p->student)->full_name . " ({$p->remaining_amount} DA)")
                ->filter()
                ->implode(", ");

            $answer = $count > 0
                ? "Il y a {$count} paiements en retard. Principaux cas : {$list}."
                : "Aucun paiement en retard.";
        }

        elseif ($this->hasAny($q, ['présence', 'présences', 'attendance', 'حضور'])) {
            $present = Attendance::where('status', 'present')->count();
            $absent = Attendance::where('status', 'absent')->count();
            $late = Attendance::where('status', 'late')->count();
            $excused = Attendance::where('status', 'excused')->count();

            $answer = "Résumé des présences : {$present} présents, {$absent} absents, {$late} retards, {$excused} excusés.";
        }

        elseif ($this->hasAny($q, ['absence', 'absences', 'absent', 'غياب', 'غائب'])) {
            $totalAbsences = Attendance::where('status', 'absent')->count();

            $top = Attendance::with('student')
                ->where('status', 'absent')
                ->selectRaw('student_id, COUNT(*) as total')
                ->groupBy('student_id')
                ->orderByDesc('total')
                ->first();

            if ($top && $top->student) {
                $answer = "Il y a {$totalAbsences} absences au total. L'étudiant le plus absent est {$top->student->full_name} avec {$top->total} absence(s).";
            } else {
                $answer = "Aucune absence enregistrée.";
            }
        }

        elseif ($this->hasAny($q, ['retard présence', 'retards', 'late', 'تأخر', 'متأخرين'])) {
            $totalLate = Attendance::where('status', 'late')->count();

            $top = Attendance::with('student')
                ->where('status', 'late')
                ->selectRaw('student_id, COUNT(*) as total')
                ->groupBy('student_id')
                ->orderByDesc('total')
                ->first();

            if ($top && $top->student) {
                $answer = "Il y a {$totalLate} retards au total. L'étudiant avec le plus de retards est {$top->student->full_name} avec {$top->total} retard(s).";
            } else {
                $answer = "Aucun retard enregistré.";
            }
        }

        elseif ($this->hasAny($q, ['risque', 'risk', 'abandon', 'خطر', 'انسحاب'])) {
            $high = RiskAnalysis::where('risk_level', 'high')->count();
            $medium = RiskAnalysis::where('risk_level', 'medium')->count();
            $low = RiskAnalysis::where('risk_level', 'low')->count();

            $top = RiskAnalysis::with('student')
                ->orderByDesc('total_risk_score')
                ->limit(5)
                ->get()
                ->map(fn ($r) => optional($r->student)->full_name . " ({$r->total_risk_score}%)")
                ->filter()
                ->implode(", ");

            $answer = "Analyse du risque : {$high} risque élevé, {$medium} moyen, {$low} faible. Étudiants à surveiller : " . ($top ?: "aucun.");
        }

        elseif ($this->hasAny($q, ['résumé', 'resume', 'summary', 'dashboard', 'ملخص'])) {
            $students = Student::where('status', 'active')->count();
            $groups = Group::where('status', 'active')->count();
            $overdue = Payment::where('payment_status', 'overdue')->count();
            $absences = Attendance::where('status', 'absent')->count();
            $highRisk = RiskAnalysis::where('risk_level', 'high')->count();

            $answer = "Résumé du centre : {$students} étudiants actifs, {$groups} groupes actifs, {$overdue} paiements en retard, {$absences} absences, {$highRisk} étudiants à risque élevé.";
        }

        elseif ($this->hasAny($q, ['capacité', 'capacity', 'places', 'مكان', 'أماكن'])) {
            $groups = Group::with('course')
                ->where('status', 'active')
                ->get()
                ->map(function ($g) {
                    $course = optional($g->course)->title ?? 'Sans formation';
                    return "{$g->name} ({$course}) : {$g->enrolled_count}/{$g->capacity}";
                })
                ->implode(" | ");

            $answer = $groups
                ? "Capacité des groupes actifs : {$groups}."
                : "Aucun groupe actif.";
        }

        $query = AiAssistantQuery::create([
            'admin_id' => $request->user()->id,
            'question' => $validated['question'],
            'answer' => $answer,
        ]);

        return response()->json([
            'data' => [
                'id' => $query->id,
                'question' => $query->question,
                'answer' => $answer,
                'askedAt' => $query->created_at->toDateTimeString(),
            ],
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $queries = AiAssistantQuery::where('admin_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get(['id', 'question', 'answer', 'created_at']);

        return response()->json([
            'data' => $queries->map(fn ($q) => [
                'id' => $q->id,
                'question' => $q->question,
                'answer' => $q->answer,
                'askedAt' => $q->created_at->toDateTimeString(),
            ]),
        ]);
    }

    private function hasAny(string $question, array $words): bool
    {
        foreach ($words as $word) {
            if (str_contains($question, mb_strtolower($word))) {
                return true;
            }
        }

        return false;
    }
}