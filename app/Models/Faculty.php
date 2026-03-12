<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Faculty extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_no',
        'department',
        'position',
        'created_by',
        'deleted_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function (self $faculty) {
            if (! $faculty->created_by) {
                $faculty->created_by = Auth::id();
            }
        });
    }
}
