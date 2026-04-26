<?php

use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\AttendanceLogController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearLevelController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('api')->group(function () {
    Route::get('/users/search', [ForgotPasswordController::class, 'search']);
    Route::post('/forgot-password/verify', [ForgotPasswordController::class, 'verify']);
    Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'reset']);
    Route::post('/forgot-password/email', [ForgotPasswordController::class, 'sendResetLink']);
});

Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin-only routes
    Route::middleware(['account.type:admin'])->group(function () {
        // Users
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::put('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

        Route::get('bin', [BinController::class, 'index'])->name('bin.index');
        Route::put('bin/courses/{course}/restore', [BinController::class, 'restoreCourse'])->name('bin.courses.restore');
        Route::delete('bin/courses/{course}/force', [BinController::class, 'forceDeleteCourse'])->name('bin.courses.force');
        Route::put('bin/events/{event}/restore', [BinController::class, 'restoreEvent'])->name('bin.events.restore');
        Route::delete('bin/events/{event}/force', [BinController::class, 'forceDeleteEvent'])->name('bin.events.force');
        Route::put('bin/faculties/{faculty}/restore', [BinController::class, 'restoreFaculty'])->name('bin.faculties.restore');
        Route::delete('bin/faculties/{faculty}/force', [BinController::class, 'forceDeleteFaculty'])->name('bin.faculties.force');
        Route::put('bin/staffs/{staff}/restore', [BinController::class, 'restoreStaff'])->name('bin.staffs.restore');
        Route::delete('bin/staffs/{staff}/force', [BinController::class, 'forceDeleteStaff'])->name('bin.staffs.force');
        Route::put('bin/students/{student}/restore', [BinController::class, 'restoreStudent'])->name('bin.students.restore');
        Route::delete('bin/students/{student}/force', [BinController::class, 'forceDeleteStudent'])->name('bin.students.force');

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

        // Reports
        Route::get('reports/attendance-count', [ReportsController::class, 'attendanceCount'])->name('reports.attendance-count');
        Route::get('reports/attendance-count/print', [ReportsController::class, 'attendanceCountPrint'])->name('reports.attendance-count-print');
    });

    // Student, Faculty, Staff routes - Attendance Logs and DTR only
    Route::middleware(['account.types:student,faculty,staff'])->group(function () {
        // Other student/faculty/staff routes can go here
    });

    // Attendance Logs and DTR - Available to ALL authenticated users (admin, student, faculty, staff)
    Route::get('attendance-logs', [AttendanceLogController::class, 'index'])->name('attendance-logs.index');
    Route::post('attendance-logs', [AttendanceLogController::class, 'store'])->name('attendance-logs.store');
    Route::get('my-dtr', [AttendanceLogController::class, 'myDtr'])->name('my-dtr');
    Route::get('dtr', [AttendanceLogController::class, 'dtr'])->name('dtr.select');
    Route::get('attendance-logs/print-dtr', [AttendanceLogController::class, 'printDtr'])->name('attendance-logs.print-dtr');
    Route::get('attendance-logs/print-dtr-batch', [AttendanceLogController::class, 'printDtrBatch'])->name('attendance-logs.print-dtr-batch');
});

require __DIR__ . '/settings.php';
