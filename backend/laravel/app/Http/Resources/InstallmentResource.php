<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'amount' => (float) $this->amount,
            'dueDate' => $this->due_date?->toDateString(),
            'paidDate' => $this->paid_date?->toDateString(),
            'status' => $this->status,
            'method' => $this->method,
            'note' => $this->note,
        ];
    }
}