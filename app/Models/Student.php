<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_no',
        'course_id',
        'year_level_id',
        'section',
        'last_name',
        'first_name',
        'middle_name',
        'extension_name',
        'created_by',
        'deleted_by',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function (self $student) {
            if (! $student->created_by) {
                $student->created_by = Auth::id();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
