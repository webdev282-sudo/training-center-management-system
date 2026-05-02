<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArchivesLog extends Model
{
    use HasFactory;
    protected $fillable = [
        'entity_type', 'entity_id', 'action', 'performed_by', 'description'
    ];

    public function performedBy()
    {
        return $this->belongsTo(Admin::class, 'performed_by');
    }
}