<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('attendance_logs')) {
            return;
        }

        DB::table('attendance_logs')
            ->where('check_type', 1)
            ->update(['check_type' => 0]);

        DB::table('attendance_logs')
            ->where('check_type', 2)
            ->update(['check_type' => 1]);

        if (Schema::hasColumn('attendance_logs', 'created_by')) {
            Schema::table('attendance_logs', function (Blueprint $table) {
                $table->dropConstrainedForeignId('created_by');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('attendance_logs')) {
            return;
        }

        if (! Schema::hasColumn('attendance_logs', 'created_by')) {
            Schema::table('attendance_logs', function (Blueprint $table) {
                $table->foreignId('created_by')->nullable()->after('check_type')->constrained('users')->nullOnDelete();
            });
        }

        DB::table('attendance_logs')
            ->where('check_type', 0)
            ->update(['check_type' => 1]);

        DB::table('attendance_logs')
            ->where('check_type', 1)
            ->update(['check_type' => 2]);
    }
};
