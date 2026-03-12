<?php

namespace Database\Seeders;

use App\Models\AttendanceLog;
use App\Models\Course;
use App\Models\Event;
use App\Models\Faculty;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use App\Models\YearLevel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class AttendanceLogsSampleSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $course = Course::query()->first() ?? Course::query()->create([
            'name' => 'BSIT',
            'description' => 'Bachelor of Science in Information Technology',
            'code' => 'BSIT',
        ]);

        $yearLevel = YearLevel::query()->first() ?? YearLevel::query()->create([
            'name' => '1st Year',
            'description' => null,
        ]);

        $eventId = $this->ensureSampleEventId();

        $admin = User::query()->orderBy('id')->first();

        $studentUser = $this->ensureUser(
            email: 'student1@example.com',
            username: 'student1',
            name: 'Sample Student',
            role: 'student',
        );
        Student::query()->firstOrCreate(
            ['user_id' => $studentUser->id],
            [
                'student_no' => 'STU-0001',
                'course_id' => $course->id,
                'year_level_id' => $yearLevel->id,
                'section' => 'A',
                'created_by' => $admin?->id,
            ],
        );

        $facultyUser = $this->ensureUser(
            email: 'faculty1@example.com',
            username: 'faculty1',
            name: 'Sample Faculty',
            role: 'faculty',
        );
        Faculty::query()->firstOrCreate(
            ['user_id' => $facultyUser->id],
            [
                'employee_no' => 'FAC-0001',
                'department' => 'IT',
                'position' => 'Instructor',
                'created_by' => $admin?->id,
            ],
        );

        $staffUser = $this->ensureUser(
            email: 'staff1@example.com',
            username: 'staff1',
            name: 'Sample Staff',
            role: 'staff',
        );
        Staff::query()->firstOrCreate(
            ['user_id' => $staffUser->id],
            [
                'employee_no' => 'STF-0001',
                'department' => 'Admin',
                'position' => 'Clerk',
                'created_by' => $admin?->id,
            ],
        );

        foreach ([$studentUser, $facultyUser, $staffUser] as $user) {
            $this->ensureDailyLogs($user->id, $eventId, Carbon::today());
            $this->ensureDailyLogs($user->id, $eventId, Carbon::yesterday());
        }
    }

    private function ensureUser(string $email, string $username, string $name, string $role): User
    {
        /** @var User $user */
        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'username' => $username,
                'password' => Hash::make('password'),
            ],
        );

        $user->forceFill(['is_active' => true])->save();

        if (method_exists($user, 'assignRole')) {
            $user->syncRoles([$role]);
        }

        return $user;
    }

    private function ensureDailyLogs(int $userId, int $eventId, Carbon $day): void
    {
        $timeIn = $day->copy()->setTime(8, 0, 0);
        $timeOut = $day->copy()->setTime(17, 0, 0);

        $this->ensureLog($userId, $eventId, $timeIn, 1);
        $this->ensureLog($userId, $eventId, $timeOut, 2);
    }

    private function ensureLog(int $userId, int $eventId, Carbon $dateTime, int $checkType): void
    {
        $exists = AttendanceLog::query()
            ->where('user_id', $userId)
            ->where('event_id', $eventId)
            ->where('check_type', $checkType)
            ->whereBetween('date_time', [$dateTime->copy()->startOfDay(), $dateTime->copy()->endOfDay()])
            ->exists();

        if ($exists) {
            return;
        }

        AttendanceLog::query()->create([
            'user_id' => $userId,
            'event_id' => $eventId,
            'date_time' => $dateTime,
            'check_type' => $checkType,
        ]);
    }

    private function ensureSampleEventId(): int
    {
        $event = Event::query()->first();
        if ($event) {
            return (int) $event->id;
        }

        $now = Carbon::now();

        if (Schema::hasColumn('events', 'name')) {
            $data = [
                'name' => 'Sample Event',
                'location' => 'Campus',
                'description' => 'Sample attendance event',
                'date_from' => $now->copy()->startOfDay(),
                'date_to' => $now->copy()->endOfDay(),
            ];

            if (Schema::hasColumn('events', 'is_active')) {
                $data['is_active'] = true;
            }

            return (int) DB::table('events')->insertGetId($data);
        }

        return (int) DB::table('events')->insertGetId([
            'title' => 'Sample Event',
            'location' => 'Campus',
            'description' => 'Sample attendance event',
            'start_at' => $now->copy()->startOfDay(),
            'end_at' => $now->copy()->endOfDay(),
        ]);
    }
}
