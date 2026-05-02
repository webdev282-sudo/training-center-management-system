<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_code', 'first_name', 'last_name', 'gender',
        'birth_date', 'phone', 'email', 'address',
        'education_level', 'specialization', 'registration_date',
        'status', 'notes', 'archived_at',
    ];
    protected $attributes = [
        'status' => 'active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'registration_date' => 'date',
        'archived_at' => 'datetime',
    ];

    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }
    public function notes() { return $this->hasMany(StudentNote::class); }
    public function riskAnalysis() { return $this->hasOne(RiskAnalysis::class); }

    public function activeGroups()
    {
        return $this->belongsToMany(Group::class, 'enrollments')
            ->wherePivot('status', 'active');
    }

    public function scopeActive(Builder $q): void { $q->where('status', 'active'); }
    public function scopeArchived(Builder $q): void { $q->where('status', 'archived'); }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
