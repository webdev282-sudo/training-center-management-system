<?php

namespace App\Observers;

use App\Models\Enrollment;
use App\Models\ArchivesLog;
use Illuminate\Support\Facades\Auth;

class EnrollmentObserver
{
    public function updated(Enrollment $enrollment): void
    {
        if ($enrollment->wasChanged('status')) {
            ArchivesLog::create([
                'entity_type' => 'enrollment',
                'entity_id'   => $enrollment->id,
                'action'      => $enrollment->status,
                'performed_by'=> Auth::id() ?? 1,
                'description' => "Inscription #{$enrollment->id} → {$enrollment->status}",
            ]);
        }
    }
}