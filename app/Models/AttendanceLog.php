<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AttendanceLog extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'date_time',
        'check_type',
        'created_by',
    ];

    protected $casts = [
        'date_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function (self $log) {
            if (! $log->created_by) {
                $log->created_by = Auth::id();
            }
        });
    }
}
