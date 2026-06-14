<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\{Exceptions, Middleware};
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))

    // ── Routing ─────────────────────────────────────────────
    ->withRouting(
        web:     __DIR__ . '/../routes/web.php',
        api:     __DIR__ . '/../routes/api.php',
        commands:__DIR__ . '/../routes/console.php',
        health:  '/up',
    )

    // ── Middleware ───────────────────────────────────────────
    ->withMiddleware(function (Middleware $middleware) {

        // $middleware->api(prepend: [
//     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
// ]);

        // Register custom middleware aliases
        $middleware->alias([
            'locale'       => \App\Http\Middleware\SetLocale::class,
            'ensure.admin' => \App\Http\Middleware\EnsureAdmin::class,
        ]);

        // Global API middleware — apply locale detection on all API routes
        $middleware->appendToGroup('api', \App\Http\Middleware\SetLocale::class);

        // Trusted proxies for production (adjust IPs as needed)
        $middleware->trustProxies(at: '*');
    })

    // ── Scheduled Commands ───────────────────────────────────
    ->withSchedule(function (Schedule $schedule) {

        // Mark overdue payments every day at midnight + 5 min
        $schedule->command('ilima:mark-overdue')
                 ->dailyAt('00:05')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Recompute AI risk scores every Monday at 06:00
        $schedule->command('ilima:analyze-risks')
                 ->weeklyOn(Schedule::MONDAY, '06:00')
                 ->withoutOverlapping()
                 ->runInBackground();
    })

    // ── Exception Handling ───────────────────────────────────
    ->withExceptions(function (Exceptions $exceptions) {

        // 422 — Validation errors → structured JSON
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // 404 — Model not found → clean JSON message
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson()) {
                $model = class_basename($e->getModel());
                return response()->json([
            'errors' => ["{$model} introuvable."],
             ],  404);
               
            }
        });

        // 401 — Unauthenticated
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => ['Non authentifié. Veuillez vous connecter.'],
                ], 401);
            }
        });

        // 422 — Business logic errors (RuntimeException from Services)
        $exceptions->render(function (\RuntimeException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => [$e->getMessage()],
                ], 422);
            }
        });

        // 500 — Generic server error in production: hide stack trace
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->expectsJson() && app()->environment('production')) {
                \Log::error($e);
                return response()->json([
                    'errors' => ['Une erreur interne est survenue. Veuillez réessayer.'],
                ], 500);
            }
        });
    })

    ->create();

