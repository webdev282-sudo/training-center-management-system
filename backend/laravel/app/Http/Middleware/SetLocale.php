<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language', 'fr');
        $allowed = ['fr', 'en'];

        app()->setLocale(in_array($locale, $allowed) ? $locale : 'fr');

        return $next($request);
    }
}