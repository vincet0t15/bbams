<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($course) {
            $course->created_by = Auth::id();
        });
    }
}
