<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Session extends Model
{
    use HasFactory;
    protected $fillable = [
        'group_id', 'teacher_id', 'title', 'session_date',
        'start_time', 'end_time', 'room', 'lesson_order', 'status', 'notes',
    ];

    protected $casts = [
        'session_date' => 'date',
    ];

    public function group() { return $this->belongsTo(Group::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }

    public function getAttendanceRateAttribute(): float
    {
        $total = $this->attendance()->count();
        $present = $this->attendance()->whereIn('status', ['present', 'late'])->count();

        return $total > 0 ? round(($present / $total) * 100, 1) : 0.0;
    }
}