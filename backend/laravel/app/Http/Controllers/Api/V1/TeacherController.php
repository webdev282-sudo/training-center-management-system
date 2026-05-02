<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\{JsonResponse, Request};

class TeacherController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $teachers = \App\Models\Teacher::query()
            ->withCount('groups')
            ->when($request->status, fn($q, $s) => $q->where('status', (bool) $s))
            ->when($request->search, fn($q, $s) =>
                $q->where(fn($q) =>
                    $q->where('full_name', 'like', "%{$s}%")
                      ->orWhere('specialty', 'like', "%{$s}%")
                )
            )
            ->orderBy('full_name')
            ->paginate(20);

        return response()->json([
            'data' => \App\Http\Resources\TeacherResource::collection($teachers),
            'meta' => ['total' => $teachers->total()],
        ]);
    }

    public function store(\App\Http\Requests\StoreTeacherRequest $request): JsonResponse
    {
        $teacher = \App\Models\Teacher::create($request->validated());

        return response()->json([
            'data' => new \App\Http\Resources\TeacherResource($teacher),
        ], 201);
    }

    public function show(\App\Models\Teacher $teacher): JsonResponse
    {
        $teacher->load([
            'groups.course',
            'groups' => fn($q) => $q->where('status', 'active'),
        ]);

        return response()->json([
            'data' => new \App\Http\Resources\TeacherResource($teacher),
        ]);
    }

    public function update(\App\Http\Requests\StoreTeacherRequest $request, \App\Models\Teacher $teacher): JsonResponse
    {
        $teacher->update($request->validated());

        return response()->json([
            'data' => new \App\Http\Resources\TeacherResource($teacher),
        ]);
    }

    public function toggleStatus(\App\Models\Teacher $teacher): JsonResponse
    {
        $teacher->update(['status' => !$teacher->status]);

        return response()->json([
            'data' => new \App\Http\Resources\TeacherResource($teacher),
        ]);
    }
}