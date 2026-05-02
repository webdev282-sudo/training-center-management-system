<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id', 'enrollment_id', 'total_amount',
        'paid_amount', 'payment_status', 'due_date',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function enrollment() { return $this->belongsTo(Enrollment::class); }
    public function installments() { return $this->hasMany(Installment::class); }

    public function recalculate(): void
    {
        $paid = $this->installments()->where('status', 'paid')->sum('amount');

        $this->paid_amount = $paid;

        $this->payment_status = match (true) {
            $paid >= $this->total_amount => 'paid',
            $paid > 0 => 'partial',
            now()->isAfter($this->due_date ?? now()->addYear()) => 'overdue',
            default => 'pending',
        };

        $this->save();
    }
}