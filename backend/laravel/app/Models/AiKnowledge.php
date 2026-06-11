<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiKnowledge extends Model
{
    protected $table = 'ai_knowledges';

    protected $fillable = [
        'admin_id',
        'title',
        'category',
        'content',
        'keywords',
        'is_active',
    ];

    protected $casts = [
        'keywords' => 'array',
        'is_active' => 'boolean',
    ];
}