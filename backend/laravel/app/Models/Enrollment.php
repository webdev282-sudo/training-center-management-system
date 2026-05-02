<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'group_id', 'enrollment_date', 'status'];
    protected $casts = ['enrollment_date' => 'date'];

    public function student() { return $this->belongsTo(Student::class); }
    public function group() { return $this->belongsTo(Group::class); }
    public function payment() { return $this->hasOne(Payment::class); }
}