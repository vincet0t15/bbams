<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'location',
        'description',
        'date_from',
        'date_to',
        'is_active',
        'created_by',
        'deleted_by',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function attendanceLogs()
    {
        return $this->hasMany(AttendanceLog::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function (self $event) {
            if (! $event->created_by) {
                $event->created_by = Auth::id();
            }
        });
    }
}
