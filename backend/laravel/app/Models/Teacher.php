<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;
    protected $fillable = ['full_name', 'phone', 'email', 'specialty', 'status', 'notes'];
    protected $casts = ['status' => 'boolean'];

    public function groups() { return $this->hasMany(Group::class); }
    public function sessions() { return $this->hasMany(Session::class); }
}