<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Installment extends Model
{
    use HasFactory;
    protected $fillable = [
        'payment_id', 'amount', 'due_date', 'paid_date', 'status', 'method', 'note',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date',
    ];

    public function payment() { return $this->belongsTo(Payment::class); }

    protected static function booted(): void
    {
        static::saved(function ($installment) {
            $installment->payment->recalculate();
        });
    }
}