<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // AI Risk Analysis
        Schema::create('risk_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('absence_score')->default(0);   // 0–100
            $table->unsignedTinyInteger('payment_score')->default(0);   // 0–100
            $table->unsignedTinyInteger('progression_score')->default(0); // 0–100
            $table->unsignedTinyInteger('total_risk_score')->default(0);  // computed
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            $table->text('recommendation')->nullable();
            $table->timestamps();

            $table->index(['risk_level', 'total_risk_score']);
        });

        // Admin notes on students
        Schema::create('student_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('admin_id')->constrained('admins')->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        // AI Assistant conversation log
        Schema::create('ai_assistant_queries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->cascadeOnDelete();
            $table->text('question');
            $table->text('answer')->nullable();
            $table->timestamps();
        });

        // Soft-delete archive log (no hard deletes in system)
        Schema::create('archives_log', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // 'student', 'enrollment', etc.
            $table->unsignedBigInteger('entity_id');
            $table->string('action'); // 'archived', 'completed', 'cancelled'
            $table->foreignId('performed_by')->constrained('admins');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archives_log');
        Schema::dropIfExists('ai_assistant_queries');
        Schema::dropIfExists('student_notes');
        Schema::dropIfExists('risk_analyses');
    }
};