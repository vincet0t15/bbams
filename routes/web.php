<?php

use App\Http\Controllers\AttendanceLogController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\YearLevelController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Users
    Route::get('users', [UserController::class, 'index'])->name('users.index');

    Route::middleware(['permission:roles.manage'])->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

        Route::put('users/{user}/roles', [UserRoleController::class, 'update'])->name('users.roles.update');

        Route::get('bin', [BinController::class, 'index'])->name('bin.index');
        Route::put('bin/courses/{course}/restore', [BinController::class, 'restoreCourse'])->name('bin.courses.restore');
        Route::delete('bin/courses/{course}/force', [BinController::class, 'forceDeleteCourse'])->name('bin.courses.force');
        Route::put('bin/events/{event}/restore', [BinController::class, 'restoreEvent'])->name('bin.events.restore');
        Route::delete('bin/events/{event}/force', [BinController::class, 'forceDeleteEvent'])->name('bin.events.force');
    });

    // Courses
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store');
    Route::put('courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

    // Year Levels
    Route::get('year-levels', [YearLevelController::class, 'index'])->name('year-levels.index');
    Route::post('year-levels', [YearLevelController::class, 'store'])->name('year-levels.store');
    Route::put('year-levels/{yearLevel}', [YearLevelController::class, 'update'])->name('year-levels.update');
    Route::delete('year-levels/{yearLevel}', [YearLevelController::class, 'destroy'])->name('year-levels.destroy');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::put('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    // Attendance Logs
    Route::get('attendance-logs', [AttendanceLogController::class, 'index'])->name('attendance-logs.index');
    Route::post('attendance-logs', [AttendanceLogController::class, 'store'])->name('attendance-logs.store');
    Route::get('attendance-logs/print-dtr', [AttendanceLogController::class, 'printDtr'])->name('attendance-logs.print-dtr');
    Route::get('attendance-logs/print-dtr-batch', [AttendanceLogController::class, 'printDtrBatch'])->name('attendance-logs.print-dtr-batch');
    Route::get('dtr', [AttendanceLogController::class, 'dtr'])->name('dtr.select');

    // Students
    Route::get('students', [StudentController::class, 'index'])->name('students.index');
    Route::post('students', [StudentController::class, 'store'])->name('students.store');
    Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    // Faculty
    Route::get('faculties', [FacultyController::class, 'index'])->name('faculties.index');
    Route::post('faculties', [FacultyController::class, 'store'])->name('faculties.store');
    Route::put('faculties/{faculty}', [FacultyController::class, 'update'])->name('faculties.update');
    Route::delete('faculties/{faculty}', [FacultyController::class, 'destroy'])->name('faculties.destroy');

    // Staff
    Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
    Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
    Route::put('staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
    Route::delete('staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');
});

require __DIR__.'/settings.php';
