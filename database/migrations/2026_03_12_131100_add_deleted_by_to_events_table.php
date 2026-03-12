<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'deleted_by')) {
                return;
            }

            $table->foreignId('deleted_by')
                ->nullable()
                ->after('created_by')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (! Schema::hasColumn('events', 'deleted_by')) {
                return;
            }

            $table->dropConstrainedForeignId('deleted_by');
        });
    }
};
