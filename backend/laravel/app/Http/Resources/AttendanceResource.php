<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'timeIn' => $this->time_in,
            'timeOut' => $this->time_out,
            'note' => $this->note,

            'student' => new StudentResource($this->whenLoaded('student')),

            'session' => $this->whenLoaded('session', function () {
                return [
                    'id' => $this->session->id,
                    'sessionDate' => $this->session->session_date?->toDateString(),
                ];
            }),
        ];
    }
}