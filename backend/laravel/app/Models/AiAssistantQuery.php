<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AiAssistantQuery extends Model
{
    use HasFactory;
    protected $fillable = ['admin_id', 'question', 'answer'];

    public function admin() { return $this->belongsTo(Admin::class); }
}