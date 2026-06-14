<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['password' => 'hashed'];

    public function studentNotes()
    {
        return $this->hasMany(StudentNote::class);
    }

    public function aiQueries()
    {
        return $this->hasMany(AiAssistantQuery::class);
    }
}