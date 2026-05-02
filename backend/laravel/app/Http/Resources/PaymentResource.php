<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'totalAmount' => (float) $this->total_amount,
            'paidAmount' => (float) $this->paid_amount,
            'remainingAmount' => (float) $this->remaining_amount,
            'paymentStatus' => $this->payment_status,
            'dueDate' => $this->due_date?->toDateString(),
            'installments' => InstallmentResource::collection($this->whenLoaded('installments')),
            'student' => new StudentResource($this->whenLoaded('student')),
        ];
    }
}