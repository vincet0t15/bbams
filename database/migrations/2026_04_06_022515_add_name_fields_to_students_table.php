<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('user_id');
            $table->string('first_name')->nullable()->after('last_name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('extension_name')->nullable()->after('middle_name');
        });

        Schema::table('faculties', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('user_id');
            $table->string('first_name')->nullable()->after('last_name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('extension_name')->nullable()->after('middle_name');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('user_id');
            $table->string('first_name')->nullable()->after('last_name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('extension_name')->nullable()->after('middle_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['last_name', 'first_name', 'middle_name', 'extension_name']);
        });

        Schema::table('faculties', function (Blueprint $table) {
            $table->dropColumn(['last_name', 'first_name', 'middle_name', 'extension_name']);
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn(['last_name', 'first_name', 'middle_name', 'extension_name']);
        });
    }
};
