<?php

use App\Http\Controllers\AttendanceLogController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ReportsController;
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
    Route::get('users', [UserController::class, 'index'])
        ->middleware('permission:accounts.view')
        ->name('users.index');

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
    Route::get('courses', [CourseController::class, 'index'])
        ->middleware('permission:courses.view')
        ->name('courses.index');
    Route::post('courses', [CourseController::class, 'store'])
        ->middleware('permission:courses.create')
        ->name('courses.store');
    Route::put('courses/{course}', [CourseController::class, 'update'])
        ->middleware('permission:courses.update')
        ->name('courses.update');
    Route::delete('courses/{course}', [CourseController::class, 'destroy'])
        ->middleware('permission:courses.delete')
        ->name('courses.destroy');

    // Year Levels
    Route::get('year-levels', [YearLevelController::class, 'index'])
        ->middleware('permission:year-levels.view')
        ->name('year-levels.index');
    Route::post('year-levels', [YearLevelController::class, 'store'])
        ->middleware('permission:year-levels.create')
        ->name('year-levels.store');
    Route::put('year-levels/{yearLevel}', [YearLevelController::class, 'update'])
        ->middleware('permission:year-levels.update')
        ->name('year-levels.update');
    Route::delete('year-levels/{yearLevel}', [YearLevelController::class, 'destroy'])
        ->middleware('permission:year-levels.delete')
        ->name('year-levels.destroy');

    // Events
    Route::get('events', [EventController::class, 'index'])
        ->middleware('permission:events.view')
        ->name('events.index');
    Route::post('events', [EventController::class, 'store'])
        ->middleware('permission:events.create')
        ->name('events.store');
    Route::put('events/{event}', [EventController::class, 'update'])
        ->middleware('permission:events.update')
        ->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])
        ->middleware('permission:events.delete')
        ->name('events.destroy');

    // Attendance Logs
    Route::get('attendance-logs', [AttendanceLogController::class, 'index'])
        ->middleware('permission:attendance-logs.view')
        ->name('attendance-logs.index');
    Route::post('attendance-logs', [AttendanceLogController::class, 'store'])
        ->middleware('permission:attendance-logs.create')
        ->name('attendance-logs.store');
    Route::get('attendance-logs/print-dtr', [AttendanceLogController::class, 'printDtr'])->name('attendance-logs.print-dtr');
    Route::get('attendance-logs/print-dtr-batch', [AttendanceLogController::class, 'printDtrBatch'])->name('attendance-logs.print-dtr-batch');
    Route::get('dtr', [AttendanceLogController::class, 'dtr'])->name('dtr.select');

    // Reports
    Route::middleware(['permission:attendance-logs.view'])->group(function () {
        Route::get('reports/attendance', [ReportsController::class, 'attendance'])->name('reports.attendance');
        Route::get('reports/attendance-count', [ReportsController::class, 'attendanceCount'])->name('reports.attendance-count');
    });

    // Students
    Route::get('students', [StudentController::class, 'index'])
        ->middleware('permission:students.view')
        ->name('students.index');
    Route::post('students', [StudentController::class, 'store'])
        ->middleware('permission:students.create')
        ->name('students.store');
    Route::put('students/{student}', [StudentController::class, 'update'])
        ->middleware('permission:students.update')
        ->name('students.update');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])
        ->middleware('permission:students.delete')
        ->name('students.destroy');

    // Faculty
    Route::get('faculties', [FacultyController::class, 'index'])
        ->middleware('permission:faculties.view')
        ->name('faculties.index');
    Route::post('faculties', [FacultyController::class, 'store'])
        ->middleware('permission:faculties.create')
        ->name('faculties.store');
    Route::put('faculties/{faculty}', [FacultyController::class, 'update'])
        ->middleware('permission:faculties.update')
        ->name('faculties.update');
    Route::delete('faculties/{faculty}', [FacultyController::class, 'destroy'])
        ->middleware('permission:faculties.delete')
        ->name('faculties.destroy');

    // Staff
    Route::get('staff', [StaffController::class, 'index'])
        ->middleware('permission:staff.view')
        ->name('staff.index');
    Route::post('staff', [StaffController::class, 'store'])
        ->middleware('permission:staff.create')
        ->name('staff.store');
    Route::put('staff/{staff}', [StaffController::class, 'update'])
        ->middleware('permission:staff.update')
        ->name('staff.update');
    Route::delete('staff/{staff}', [StaffController::class, 'destroy'])
        ->middleware('permission:staff.delete')
        ->name('staff.destroy');
});

require __DIR__.'/settings.php';
