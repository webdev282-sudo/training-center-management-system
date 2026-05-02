<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next, string $role = 'admin')
    {
        $admin = $request->user();

        if (!$admin || ($role === 'super_admin' && $admin->role !== 'super_admin')) {
            return response()->json(['errors' => ['Accès non autorisé.']], 403);
        }

        return $next($request);
    }
}