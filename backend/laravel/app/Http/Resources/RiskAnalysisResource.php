<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RiskAnalysisResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'absenceScore' => $this->absence_score,
            'paymentScore' => $this->payment_score,
            'progressionScore' => $this->progression_score,
            'totalRiskScore' => $this->total_risk_score,
            'riskLevel' => $this->risk_level,
            'recommendation' => $this->recommendation,
            'updatedAt' => $this->updated_at?->toDateTimeString(),
        ];
    }
}