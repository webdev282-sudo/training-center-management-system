<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_code')->unique(); // e.g. STU-2024-0001
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['M', 'F'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('phone');
            $table->string('email')->nullable()->unique();
            $table->text('address')->nullable();
            $table->string('education_level')->nullable();
            $table->string('specialization')->nullable();
            $table->date('registration_date');
            $table->enum('status', ['active', 'completed', 'archived'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};