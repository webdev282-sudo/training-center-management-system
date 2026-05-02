<?php

namespace App\Http\Controllers\Api\V1;
use App\Services\SessionGeneratorService;
use App\Http\Resources\SessionResource;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\Group;
class SessionController extends Controller
{
    public function __construct(private SessionGeneratorService $generator) {}
 
    public function index(Request $request): JsonResponse
    {
        $sessions = Session::query()
            ->with(['group.course', 'teacher:id,full_name'])
            ->when($request->group_id,  fn($q, $id) => $q->where('group_id', $id))
            ->when($request->date,      fn($q, $d)  => $q->whereDate('session_date', $d))
            ->when($request->status,    fn($q, $s)  => $q->where('status', $s))
            ->when($request->from_date, fn($q, $d)  => $q->whereDate('session_date', '>=', $d))
            ->when($request->to_date,   fn($q, $d)  => $q->whereDate('session_date', '<=', $d))
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->paginate(30);
 
        return response()->json([
            'data' => SessionResource::collection($sessions),
            'meta' => [
                'total'       => $sessions->total(),
                'currentPage' => $sessions->currentPage(),
                'lastPage'    => $sessions->lastPage(),
            ],
        ]);
    }
 
    public function show(Session $session): JsonResponse
    {
        $session->load(['group.course', 'teacher', 'attendance.student']);
 
        return response()->json([
            'data' => new SessionResource($session),
        ]);
    }
 
    public function update(Request $request, Session $session): JsonResponse
    {
        $validated = $request->validate([
            'title'   => 'nullable|string|max:200',
            'status'  => 'nullable|in:scheduled,completed,cancelled',
            'notes'   => 'nullable|string',
            'room'    => 'nullable|string|max:50',
        ]);
 
        $session->update($validated);
 
        return response()->json(['data' => new SessionResource($session)]);
    }
 
    public function generate(Group $group): JsonResponse
    {
        if ($group->status !== 'active') {
            return response()->json(['errors' => ['Seuls les groupes actifs peuvent générer des séances.']], 422);
        }
 
        $created = $this->generator->generateForGroup($group);
 
        return response()->json([
            'message' => "{$created} séance(s) générée(s).",
            'data'    => ['created' => $created],
        ]);
    }
}