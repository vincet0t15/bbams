<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'location',
        'description',
        'start_at',
        'end_at',
        'created_by',
        'deleted_by',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
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
