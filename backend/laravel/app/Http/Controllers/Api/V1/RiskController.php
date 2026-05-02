<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RiskAnalysisResource;
use App\Models\Student;
use App\Models\RiskAnalysis;
use App\Services\RiskAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RiskController extends Controller
{
    public function __construct(private RiskAnalysisService $riskService) {}

    public function index(Request $request): JsonResponse
    {
        $analyses = RiskAnalysis::with('student')
            ->when($request->level, fn($q, $l) => $q->where('risk_level', $l))
            ->orderByDesc('total_risk_score')
            ->paginate(25);

        return response()->json([
            'data' => RiskAnalysisResource::collection($analyses),
            'meta' => ['total' => $analyses->total()],
        ]);
    }

    public function analyze(Student $student): JsonResponse
    {
        $result = $this->riskService->analyze($student);
        return response()->json(['data' => new RiskAnalysisResource($result)]);
    }

    public function analyzeAll(): JsonResponse
    {
        $this->riskService->analyzeAll();
        return response()->json([
            'message' => 'Analyse IA complète pour tous les étudiants actifs.'
        ]);
    }
}