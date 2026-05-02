<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\EnrollmentService;
use App\Models\{Group, Enrollment, Student};
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    public function __construct(private EnrollmentService $enrollmentService) {}

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'group_id'   => 'required|exists:groups,id',
        ]);
        if (Enrollment::where('student_id', $request->student_id)
    ->where('group_id', $request->group_id)
    ->exists()) {
    return response()->json([
        'message' => 'Student is already enrolled in this group.'
    ], 422);
}

        $enrollment = $this->enrollmentService->enroll(
            Student::findOrFail($request->student_id),
            Group::findOrFail($request->group_id)
        );

        return response()->json([
            'data' => $enrollment->load('group.course', 'payment')
        ], 201);
    }
}