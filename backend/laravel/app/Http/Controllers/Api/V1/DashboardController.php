<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\{Student, Group, Session as SessionModel, Payment, RiskAnalysis};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;

class DashboardController extends Controller
{
    public function kpis(): JsonResponse
    {
        $overduePayments = Payment::where('payment_status', 'overdue')
            ->orWhere(fn($q) => $q->where('payment_status', 'partial')
                ->whereDate('due_date', '<', today()))
            ->count();

        return response()->json([
            'data' => [
                'activeStudents'    => Student::active()->count(),
                'activeCourses'     => \App\Models\Course::where('status', true)->count(),
                'activeGroups'      => Group::where('status', 'active')->count(),
                'overduePayments'   => $overduePayments,
                'avgAttendanceRate' => $this->globalAttendanceRate(),
                'atRiskStudents'    => RiskAnalysis::where('risk_level', 'high')->count(),
            ],
        ]);
    }

    public function overduePayments(): JsonResponse
    {
        $payments = Payment::with(['student', 'enrollment.group.course'])
            ->whereIn('payment_status', ['overdue', 'partial', 'pending'])
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => PaymentResource::collection($payments)
        ]);
    }

    private function globalAttendanceRate(): float
    {
        $result = DB::table('attendance')
            ->selectRaw('COUNT(*) as total, SUM(status IN ("present","late")) as present')
            ->first();

        return $result->total > 0
            ? round(($result->present / $result->total) * 100, 1)
            : 0.0;
    }
}