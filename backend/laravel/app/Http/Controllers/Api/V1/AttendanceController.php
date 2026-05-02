<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\Session as SessionModel;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceService $attendanceService) {}
    public function index(Request $request): JsonResponse
{
    $request->validate([
        'session_id' => 'nullable|exists:sessions,id',
        'group_id'   => 'nullable|exists:groups,id',
        'date'       => 'nullable|date',
    ]);

    $records = Attendance::query()
    ->with([
    'student:id,first_name,last_name,student_code',
    'student.payments', 
    'session'
       ])
        

        
        ->when($request->session_id, fn($q, $id) =>
            $q->where('session_id', $id)
        )

        
        ->when($request->group_id, function ($q, $groupId) {
            $sessionIds = SessionModel::where('group_id', $groupId)->pluck('id');
            $q->whereIn('session_id', $sessionIds);
        })

        // حسب التاريخ
        ->when($request->date, fn($q, $date) =>
            $q->whereHas('session', fn($q) =>
                $q->whereDate('session_date', $date)
            )
        )

        ->orderByDesc('created_at')
        ->get();

    return response()->json([
        'data' => AttendanceResource::collection($records),
    ]);
}
 
    
 
    public function bulkRecord(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id'           => 'required|exists:sessions,id',
            'records'              => 'required|array|min:1',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status'     => 'required|in:present,absent,late,excused',
            'records.*.time_in'    => 'nullable|date_format:H:i',
            'records.*.time_out'   => 'nullable|date_format:H:i|after:records.*.time_in',
            'records.*.note'       => 'nullable|string|max:500',
        ]);
 
        $this->attendanceService->record($validated['session_id'], $validated['records']);
 
          SessionModel::findOrFail($validated['session_id'])
            ->update(['status' => 'completed']);
 
        return response()->json(['message' => 'Présences enregistrées avec succès.']);
    }
}