<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('year_levels', function (Blueprint $table) {
            if (! Schema::hasColumn('year_levels', 'course_id')) {
                return;
            }

            $table->dropConstrainedForeignId('course_id');
        });
    }

    public function down(): void
    {
        Schema::table('year_levels', function (Blueprint $table) {
            if (Schema::hasColumn('year_levels', 'course_id')) {
                return;
            }

            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
        });
    }
};
