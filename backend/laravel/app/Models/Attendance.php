<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;
    protected $fillable = [
        'session_id', 'student_id', 'status', 'time_in', 'time_out', 'note',
    ];

    public function session() { return $this->belongsTo(Session::class); }
    public function student() { return $this->belongsTo(Student::class); }
}