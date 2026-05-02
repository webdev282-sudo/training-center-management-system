<?php

namespace App\Observers;

use App\Models\Student;
use App\Models\ArchivesLog;
use Illuminate\Support\Facades\Auth;

class StudentObserver
{
    public function updated(Student $student): void
    {
        if ($student->wasChanged('status') && $student->status === 'archived') {
            ArchivesLog::create([
                'entity_type' => 'student',
                'entity_id'   => $student->id,
                'action'      => 'archived',
                'performed_by'=> Auth::id() ?? 1,
                'description' => "Étudiant {$student->student_code} archivé.",
            ]);
        }
    }
}