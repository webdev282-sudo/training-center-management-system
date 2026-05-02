<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\{JsonResponse, Request};

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $courses = \App\Models\Course::query()
            ->with('domain')
            ->withCount(['groups as active_groups_count' => fn($q) => $q->where('status', 'active')])
            ->when($request->domain_id, fn($q, $id) => $q->where('domain_id', $id))
            ->when($request->status, fn($q, $s) => $q->where('status', (bool) $s))
            ->when($request->level, fn($q, $l) => $q->where('level', $l))
            ->when($request->search, fn($q, $s) =>
                $q->where(fn($q) =>
                    $q->where('title', 'like', "%{$s}%")
                      ->orWhere('description', 'like', "%{$s}%")
                )
            )
            ->orderBy('title')
            ->paginate(20);

        return response()->json([
            'data' => \App\Http\Resources\CourseResource::collection($courses),
            'meta' => ['total' => $courses->total()],
        ]);
    }

    public function store(\App\Http\Requests\StoreCourseRequest $request): JsonResponse
    {
        $course = \App\Models\Course::create($request->validated());
        $course->load('domain');

        return response()->json([
            'data' => new \App\Http\Resources\CourseResource($course),
        ], 201);
    }

    public function show(\App\Models\Course $course): JsonResponse
    {
        $course->load([
            'domain',
            'groups' => fn($q) => $q->with('teacher')->where('status', 'active'),
        ]);

        return response()->json([
            'data' => new \App\Http\Resources\CourseResource($course),
        ]);
    }

    public function update(\App\Http\Requests\StoreCourseRequest $request, \App\Models\Course $course): JsonResponse
    {
        $course->update($request->validated());
        $course->load('domain');

        return response()->json([
            'data' => new \App\Http\Resources\CourseResource($course),
        ]);
    }

    public function toggleStatus(\App\Models\Course $course): JsonResponse
    {
        $course->update(['status' => !$course->status]);

        return response()->json([
            'data' => new \App\Http\Resources\CourseResource($course),
        ]);
    }
}