<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Users
    Route::get('users', [UserController::class, 'index'])->name('users.index');


    // Courses
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store');
    Route::put('courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
});

require __DIR__ . '/settings.php';
