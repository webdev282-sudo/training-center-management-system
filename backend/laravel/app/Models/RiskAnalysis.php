<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiskAnalysis extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id', 'absence_score', 'payment_score',
        'progression_score', 'total_risk_score', 'risk_level', 'recommendation',
    ];

    protected $casts = [
        'absence_score' => 'integer',
        'payment_score' => 'integer',
        'progression_score' => 'integer',
        'total_risk_score' => 'integer',
    ];

    public function student() { return $this->belongsTo(Student::class); }
}