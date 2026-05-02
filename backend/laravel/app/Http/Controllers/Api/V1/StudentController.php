<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Requests\StoreStudentRequest;
use App\Models\Student;
use Illuminate\Http\{JsonResponse, Request};
class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $students = Student::query()
           ->with([
    'activeGroups.course',
    'enrollments.group.course',
    'payments',
])
            ->when($request->search, fn($q, $s) =>
                $q->where(fn($q) =>
                    $q->where('first_name', 'like', "%{$s}%")
                      ->orWhere('last_name',  'like', "%{$s}%")
                      ->orWhere('student_code', 'like', "%{$s}%")
                      ->orWhere('phone', 'like', "%{$s}%")
                )
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->course_id, fn($q, $id) =>
                $q->whereHas('enrollments.group', fn($q) => $q->where('course_id', $id))
            )
            ->orderBy('last_name')
            ->paginate(25);
 
        return response()->json([
            'data' => StudentResource::collection($students),
            'meta' => [
                'total'       => $students->total(),
                'currentPage' => $students->currentPage(),
                'lastPage'    => $students->lastPage(),
            ],
        ]);
    }
 
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $data            = $request->validated();
        $data['student_code']      = $this->generateCode();
        $data['registration_date'] = today()->toDateString();
 
        $student = Student::create($data);
 
        return response()->json(['data' => new StudentResource($student)], 201);
    }
 
    public function show($id): JsonResponse
{
    $student = Student::with([
        'activeGroups.course',
        'enrollments.group.course',
        'payments.installments',
        'riskAnalysis',
        'notes.admin',
    ])->find($id);

    if (!$student) {
        return response()->json([
            'errors' => ['Student not found']
        ], 404);
    }

    return response()->json(['data' => new StudentResource($student)]);
}
 
    public function update(StoreStudentRequest $request, Student $student): JsonResponse
    {
        $student->update($request->validated());
 
        return response()->json(['data' => new StudentResource($student)]);
    }
 
    public function archive(Student $student): JsonResponse
    {
        $student->update(['status' => 'archived', 'archived_at' => now()]);
 
        return response()->json(['data' => new StudentResource($student)]);
    }
    public function restore(Student $student): JsonResponse
{
    $student->update([
        'status' => 'active',
        'archived_at' => null,
    ]);

    $student->load(['activeGroups.course', 'enrollments.group.course', 'payments']);

    return response()->json(['data' => new StudentResource($student)]);
}
 
    private function generateCode(): string
    {
        $year  = now()->year;
        $count = Student::whereYear('created_at', $year)->count() + 1;
        return sprintf('STU-%d-%04d', $year, $count);
    }
}