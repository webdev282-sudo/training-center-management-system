<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with([
                'student.payments',
                'installments',
            ])
            ->when($request->filled('status'), fn ($q) =>
                $q->where('payment_status', $request->status)
            )
            ->when($request->filled('student_id'), fn ($q) =>
                $q->where('student_id', $request->student_id)
            )
            ->orderByDesc('updated_at')
            ->paginate(25);

        return response()->json([
            'data' => PaymentResource::collection($payments),
            'meta' => [
                'total' => $payments->total(),
            ],
        ]);
    }

    public function addInstallment(Request $request, Payment $payment): JsonResponse
    {
        $validated = $request->validate([
            'amount'   => "required|numeric|min:1|max:{$payment->remaining_amount}",
            'due_date' => 'required|date',
            'note'     => 'nullable|string',
        ]);

        $payment->installments()->create([
            ...$validated,
            'paid_date' => today()->toDateString(),
            'status'    => 'paid',
            'method'    => 'cash',
        ]);

        return response()->json([
            'data' => new PaymentResource(
                $payment->fresh(['student.payments', 'installments'])
            ),
        ], 201);
    }
}