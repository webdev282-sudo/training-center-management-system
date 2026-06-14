<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    Auth\AuthController,
    StudentNoteController,
    StudentController,
    EnrollmentController,
    GroupController,
    TeacherController,
    CourseController,
    DomainController,
    SessionController,
    AttendanceController,
    PaymentController,
    DashboardController,
    RiskController,
    AiAssistantController,
    ReportController,
};
use App\Http\Controllers\Api\V1\SettingController;

Route::prefix('v1')->group(function () {

    // ── Auth (public) ────────────────────────────────────────
    Route::post('auth/login',  [AuthController::class, 'login']);
    Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    // ── Protected ────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
       

        // Dashboard
        Route::prefix('dashboard')->group(function () {
            Route::get('kpis',             [DashboardController::class, 'kpis']);
            Route::get('overdue-payments', [DashboardController::class, 'overduePayments']);
        });

        // Students
        Route::apiResource('students', StudentController::class)->except(['destroy']);
        Route::patch('students/{student}/archive', [StudentController::class, 'archive']);
        Route::patch('/students/{student}/restore', [StudentController::class, 'restore']);

        
        // Student Notes
Route::prefix('students/{student}/notes')->group(function () {
    Route::get('/', [StudentNoteController::class, 'index']);
    Route::post('/', [StudentNoteController::class, 'store']);
    Route::delete('/{note}', [StudentNoteController::class, 'destroy']);
});  
        

        // Teachers
        Route::apiResource('teachers', TeacherController::class)->except(['destroy']);
        Route::patch('teachers/{teacher}/toggle-status', [TeacherController::class, 'toggleStatus']);

        // Domains
        Route::apiResource('domains', DomainController::class);

        // Courses
        Route::apiResource('courses', CourseController::class)->except(['destroy']);
        Route::patch('courses/{course}/toggle-status', [CourseController::class, 'toggleStatus']);

        // Groups
        Route::apiResource('groups', GroupController::class)->except(['destroy']);
        Route::patch('groups/{group}/complete',           [GroupController::class, 'complete']);
        Route::post('groups/{group}/generate-sessions',   [GroupController::class, 'generateSessions']);

        // Enrollments
        Route::post('enrollments',               [EnrollmentController::class, 'store']);
        Route::patch('enrollments/{enrollment}', [EnrollmentController::class, 'update']);

        // Sessions
        Route::apiResource('sessions', SessionController::class)->only(['index', 'show', 'update']);

        // Attendance
        Route::get('attendance',       [AttendanceController::class, 'index']);
        Route::post('attendance/bulk', [AttendanceController::class, 'bulkRecord']);

        // Payments
        Route::get('payments',                         [PaymentController::class, 'index']);
        Route::get('payments/{payment}',               [PaymentController::class, 'show']);
        Route::post('payments/{payment}/installments', [PaymentController::class, 'addInstallment']);

        // AI — Risk Analysis
        Route::prefix('ai')->group(function () {
            Route::get('risk-analyses',        [RiskController::class, 'index']);
            Route::post('analyze/{student}',   [RiskController::class, 'analyze']);
            Route::post('analyze-all',         [RiskController::class, 'analyzeAll']);

            // AI Assistant (Claude API)
            Route::post('assistant',           [AiAssistantController::class, 'ask']);
            Route::get('assistant/history',    [AiAssistantController::class, 'history']);
            Route::get('assistant/knowledge', [AiAssistantController::class, 'knowledgeIndex']);
Route::post('assistant/knowledge', [AiAssistantController::class, 'knowledgeStore']);
Route::delete('assistant/knowledge/{knowledge}', [AiAssistantController::class, 'knowledgeDestroy']);
        });

        // Reports — PDF downloads
        // Reports — PDF downloads
        
Route::prefix('reports')->group(function () {
    Route::get('student/{student}',        [ReportController::class, 'studentProfile']);
    Route::get('group/{group}/roster',     [ReportController::class, 'groupRoster']);
    Route::get('group/{group}/attendance', [ReportController::class, 'attendanceReport']);
    Route::get('payment/{payment}/receipt',[ReportController::class, 'paymentReceipt']);

    Route::get('payments', [ReportController::class, 'paymentsReport']);

    Route::get('schedule', [ReportController::class, 'weeklySchedule']);
});
    });
    Route::get('students-payments', [ReportController::class, 'studentsPaymentsReport']);
});
