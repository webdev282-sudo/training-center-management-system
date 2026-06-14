<?php


namespace App\Http\Controllers\Api\V1;
 
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Services\SessionGeneratorService;
use Illuminate\Http\{JsonResponse, Request};
 
class GroupController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $groups = Group::query()
            ->with(['course.domain', 'teacher'])
            ->withCount(['enrollments as enrolled_students' => fn($q) => $q->where('status', 'active')])
            ->when($request->status,    fn($q, $s)  => $q->where('status', $s))
            ->when($request->course_id, fn($q, $id) => $q->where('course_id', $id))
            ->when($request->teacher_id,fn($q, $id) => $q->where('teacher_id', $id))
            ->when($request->search,    fn($q, $s)  => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('status')
            ->orderBy('name')
            ->paginate(20);
 
        return response()->json([
            'data' => GroupResource::collection($groups),
            'meta' => [
                'total'       => $groups->total(),
                'currentPage' => $groups->currentPage(),
                'lastPage'    => $groups->lastPage(),
            ],
        ]);
    }
 
    public function store(StoreGroupRequest $request): JsonResponse
{
    $group = Group::create([
        ...$request->validated(),
        'status' => 'active',
    ]);

    $group->load(['course.domain', 'teacher']);

    return response()->json(['data' => new GroupResource($group)], 201);
}
 
    public function show(Group $group): JsonResponse
    {
        $group->load([
            'course.domain',
            'teacher',
            'enrollments.student',
            'sessions' => fn($q) => $q->orderBy('session_date')->orderBy('start_time'),
        ]);
 
        return response()->json(['data' => new GroupResource($group)]);
    }
 
    public function update(StoreGroupRequest $request, Group $group): JsonResponse
    {
        $group->update($request->validated());
        $group->load(['course.domain', 'teacher']);
 
        return response()->json(['data' => new GroupResource($group)]);
    }
 
    /**
     * Mark group as completed — soft close, no deletion.
     */
    public function complete(Group $group): JsonResponse
    {
        $group->update(['status' => 'completed']);
 
        // Complete all active enrollments in this group
        $group->enrollments()->where('status', 'active')->update(['status' => 'completed']);
 
        return response()->json(['data' => new GroupResource($group)]);
    }
 
    /**
     * Generate sessions from weekly schedule and return count.
     */
    public function generateSessions(Group $group, SessionGeneratorService $generator): JsonResponse
    {
        if ($group->status !== 'active') {
            return response()->json(['errors' => ['Seuls les groupes actifs peuvent générer des séances.']], 422);
        }
 
        $created = $generator->generateForGroup($group);
 
        return response()->json([
            'message' => "{$created} séance(s) générée(s).",
            'data'    => ['created' => $created],
        ]);
    }
}