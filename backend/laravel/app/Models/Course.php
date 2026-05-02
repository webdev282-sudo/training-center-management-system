<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'domain_id', 'title', 'description', 'duration',
        'sessions_count', 'price', 'level', 'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sessions_count' => 'integer',
        'status' => 'boolean',
    ];

    public function domain() { return $this->belongsTo(Domain::class); }
    public function groups() { return $this->hasMany(Group::class); }
}