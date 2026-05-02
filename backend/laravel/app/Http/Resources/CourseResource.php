<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration' => $this->duration,
            'sessionsCount' => $this->sessions_count,
            'price' => (float) $this->price,
            'level' => $this->level,
            'status' => $this->status,
            'domain' => new DomainResource($this->whenLoaded('domain')),
        ];
    }
}