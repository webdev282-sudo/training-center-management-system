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
    Schema::create('archives_logs', function (Blueprint $table) {
        $table->id();
        $table->string('entity_type');
        $table->unsignedBigInteger('entity_id');
        $table->string('action');
        $table->unsignedBigInteger('performed_by')->nullable();
        $table->text('description')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('archives_logs');
}
};
