<?php
namespace App\Http\Controllers\Api\V1;
 
use App\Http\Controllers\Controller;
use App\Models\{Student, StudentNote};
use Illuminate\Http\{JsonResponse, Request};
 
class StudentNoteController extends Controller
{
    public function index(Student $student): JsonResponse
    {
        $notes = $student->notes()
            ->with('admin:id,name')
            ->orderByDesc('created_at')
            ->get();
 
        return response()->json([
            'data' => $notes->map(fn($note) => [
                'id'        => $note->id,
                'content'   => $note->content,
                'createdAt' => $note->created_at->toDateTimeString(),
                'admin'     => [
                    'id'   => $note->admin->id,
                    'name' => $note->admin->name,
                ],
            ]),
        ]);
    }
 
    public function store(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:2000',
        ]);
 
        $note = StudentNote::create([
            'student_id' => $student->id,
            'admin_id'   => $request->user()->id,
            'content'    => $validated['content'],
        ]);
 
        $note->load('admin:id,name');
 
        return response()->json([
            'data' => [
                'id'        => $note->id,
                'content'   => $note->content,
                'createdAt' => $note->created_at->toDateTimeString(),
                'admin'     => ['id' => $note->admin->id, 'name' => $note->admin->name],
            ],
        ], 201);
    }
 
    public function destroy(Student $student, StudentNote $note): JsonResponse
    {
        // Only the author or super_admin can delete
        if ($note->admin_id !== request()->user()->id && request()->user()->role !== 'super_admin') {
            return response()->json(['errors' => ['Non autorisé.']], 403);
        }
 
        abort_if($note->student_id !== $student->id, 404);
 
        $note->delete();
 
        return response()->json(null, 204);
    }
}