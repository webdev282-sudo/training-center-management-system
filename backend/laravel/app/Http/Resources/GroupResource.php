<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'room' => $this->room,
            'days' => $this->days,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'startDate' => $this->start_date?->toDateString(),
            'endDate' => $this->end_date?->toDateString(),
            'capacity' => $this->capacity,
            'enrolledCount' => $this->enrolled_count,
            'availableSlots' => $this->available_slots,
            'progressPercent' => $this->progress_percent,
            'status' => $this->status,

            'course' => new CourseResource($this->whenLoaded('course')),
            'teacher' => new TeacherResource($this->whenLoaded('teacher')),

            'enrollments' => $this->whenLoaded('enrollments', function () {
                return $this->enrollments->map(function ($enrollment) {
                    return [
                        'id' => $enrollment->id,
                        'status' => $enrollment->status,
                        'student' => $enrollment->student ? [
                            'id' => $enrollment->student->id,
                            'studentCode' => $enrollment->student->student_code,
                            'first_name' => $enrollment->student->first_name,
                            'last_name' => $enrollment->student->last_name,
                            'fullName' => $enrollment->student->full_name,
                            'phone' => $enrollment->student->phone,
                            'email' => $enrollment->student->email,
                            'status' => $enrollment->student->status,
                        ] : null,
                    ];
                });
            }),
        ];
    }
}