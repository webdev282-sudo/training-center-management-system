<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'studentCode' => $this->student_code,
            'fullName' => $this->full_name,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'gender' => $this->gender,
            'phone' => $this->phone,
            'email' => $this->email,
            'registrationDate' => $this->registration_date?->toDateString(),
            'status' => $this->status,

            'activeGroups' => GroupResource::collection(
                $this->whenLoaded('activeGroups')
            ),

            'formations' => $this->whenLoaded('enrollments', function () {
                return $this->enrollments
                    ->map(function ($enrollment) {
                        return $enrollment->group?->course ? [
                            'id' => $enrollment->group->course->id,
                            'title' => $enrollment->group->course->title,
                            'group' => $enrollment->group->name,
                            'status' => $enrollment->status,
                        ] : null;
                    })
                    ->filter()
                    ->values();
            }),

            'riskAnalysis' => new RiskAnalysisResource(
                $this->whenLoaded('riskAnalysis')
            ),

            'paymentStatus' => $this->whenLoaded('payments', function () {
                return $this->payments
                    ->sortByDesc('created_at')
                    ->first()?->payment_status;
            }),
        ];
    }
}