<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'sessionDate' => $this->session_date?->toDateString(),
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'room' => $this->room,
            'lessonOrder' => $this->lesson_order,
            'status' => $this->status,
            'attendanceRate' => $this->attendance_rate,
            'group' => new GroupResource($this->whenLoaded('group')),
        ];
    }
}