<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentNote extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'admin_id', 'content'];

    public function student() { return $this->belongsTo(Student::class); }
    public function admin() { return $this->belongsTo(Admin::class); }
}