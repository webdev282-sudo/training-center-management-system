<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Group;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function studentProfile(Student $student): Response
    {
        $student->load([
            'enrollments.group.course',
            'payments.installments',
            'riskAnalysis',
            'notes'
        ]);

        $pdf = Pdf::loadView('reports.student-profile', compact('student'));

        return $pdf->download("profil-{$student->student_code}.pdf");
    }

    public function groupRoster(Group $group): Response
    {
        $group->load(['students', 'course', 'teacher']);

        $pdf = Pdf::loadView('reports.group-roster', compact('group'));

        return $pdf->download("roster-{$group->name}.pdf");
    }

    public function attendanceReport(Group $group): Response
    {
        $group->load(['sessions.attendance.student', 'course', 'teacher']);

        $pdf = Pdf::loadView('reports.attendance', compact('group'));

        return $pdf->download("presence-{$group->name}.pdf");
    }

    public function paymentReceipt(Payment $payment): Response
    {
        $payment->load([
            'student',
            'enrollment.group.course',
            'installments'
        ]);

        $pdf = Pdf::loadView('reports.receipt', compact('payment'));

        return $pdf->download("recu-paiement-{$payment->id}.pdf");
    }

    public function paymentsReport(Request $request): Response
    {
        $payments = Payment::with([
            'student',
            'enrollment.group.course',
            'installments'
        ])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('reports.payments', compact('payments'))
            ->setPaper('a4', 'landscape');

        return $pdf->download('rapport-paiements.pdf');
    }

    public function weeklySchedule(Request $request)
    {
        try {
            $groups = Group::with(['course', 'teacher'])
                ->where('status', 'active')
                ->get();

            $pdf = Pdf::loadView('reports.schedule', [
                'groups' => $groups,
            ])->setPaper('a4', 'landscape');

            return $pdf->download('planning-hebdomadaire.pdf');

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Schedule PDF failed',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function studentsPaymentsReport(Request $request): Response
    {
        $students = Student::with([
            'payments.installments',
            'payments.enrollment.group.course',
            'enrollments.group.course',
        ])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $pdf = Pdf::loadView('reports.students-payments', compact('students'))
            ->setPaper('a4', 'landscape');

        return $pdf->download('rapport-etudiants-paiements.pdf');
    }
}