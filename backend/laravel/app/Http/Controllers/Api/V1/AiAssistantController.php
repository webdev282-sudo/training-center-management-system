<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\{
    AiAssistantQuery,
    AiKnowledge,
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

// Recherche dans la base de connaissance
$knowledge = AiKnowledge::where('is_active', true)
    ->get()
    ->first(function ($item) use ($q) {

        if (str_contains($q, mb_strtolower($item->title))) {
            return true;
        }

        if ($item->category &&
            str_contains($q, mb_strtolower($item->category))) {
            return true;
        }

        foreach (($item->keywords ?? []) as $keyword) {
            if (str_contains($q, mb_strtolower($keyword))) {
                return true;
            }
        }

        return false;
    });

if ($knowledge) {

    $answer = $knowledge->content;

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



        // 1) Search teacher/admin knowledge first
        $knowledgeAnswer = $this->answerFromKnowledge($q);

        if ($knowledgeAnswer) {
            $answer = $knowledgeAnswer;
        } else {
            $answer = $this->answerFromSystemData($q);
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

    public function knowledgeIndex(): JsonResponse
    {
        $items = AiKnowledge::orderByDesc('created_at')->get();

        return response()->json([
            'data' => $items,
        ]);
    }

    public function knowledgeStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'category' => 'nullable|string|max:80',
            'content' => 'required|string|min:5',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:50',
        ]);

        $knowledge = AiKnowledge::create([
            'admin_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'content' => $validated['content'],
            'keywords' => $validated['keywords'] ?? [],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Information ajoutée à la base de connaissance.',
            'data' => $knowledge,
        ], 201);
    }

    public function knowledgeDestroy(AiKnowledge $knowledge): JsonResponse
    {
        $knowledge->delete();

        return response()->json([
            'message' => 'Information supprimée.',
        ]);
    }

    private function answerFromKnowledge(string $q): ?string
    {
        $items = AiKnowledge::where('is_active', true)->get();

        $best = null;
        $bestScore = 0;

        foreach ($items as $item) {
            $score = 0;

            $title = mb_strtolower($item->title ?? '');
            $category = mb_strtolower($item->category ?? '');
            $content = mb_strtolower($item->content ?? '');

            foreach ($this->words($q) as $word) {
                if (mb_strlen($word) < 3) {
                    continue;
                }

                if (str_contains($title, $word)) {
                    $score += 4;
                }

                if (str_contains($category, $word)) {
                    $score += 3;
                }

                if (str_contains($content, $word)) {
                    $score += 2;
                }
            }

            foreach (($item->keywords ?? []) as $keyword) {
                $keyword = mb_strtolower($keyword);

                if ($keyword && str_contains($q, $keyword)) {
                    $score += 6;
                }
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $item;
            }
        }

        if (!$best || $bestScore < 3) {
            return null;
        }

        return "D'après les informations enregistrées :\n\n{$best->content}";
    }

    private function answerFromSystemData(string $q): string
    {
        $answer = "Je n'ai pas trouvé cette information dans la base de connaissance. Vous pouvez l'ajouter dans l'onglet Base de connaissance pour que je puisse répondre la prochaine fois.";

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

        elseif ($this->hasAny($q, ['paiement', 'paiements', 'payment', 'payments', 'دفع', 'دفعات', 'partiel', 'partial'])) {
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

            $answer = $top && $top->student
                ? "Il y a {$totalAbsences} absences au total. L'étudiant le plus absent est {$top->student->full_name} avec {$top->total} absence(s)."
                : "Aucune absence enregistrée.";
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

        return $answer;
    }

    private function words(string $text): array
    {
        $text = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $text);
        return array_values(array_filter(explode(' ', mb_strtolower($text))));
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