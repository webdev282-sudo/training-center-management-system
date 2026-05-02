<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory;
    protected $fillable = [
        'course_id', 'teacher_id', 'name', 'room',
        'start_date', 'end_date', 'days',
        'start_time', 'end_time', 'capacity', 'progress_percent', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'days' => 'array',
        'capacity' => 'integer',
        'progress_percent' => 'integer',
    ];

    public function course() { return $this->belongsTo(Course::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function sessions() { return $this->hasMany(Session::class); }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
            ->withPivot('status', 'enrollment_date')
            ->withTimestamps();
    }

    public function getEnrolledCountAttribute(): int
    {
        return $this->enrollments()->where('status', 'active')->count();
    }

    public function getAvailableSlotsAttribute(): int
    {
        return $this->capacity - $this->enrolled_count;
    }
}