<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = Setting::firstOrCreate([]);

        return response()->json([
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'center_name' => 'required|string|max:255',
            'currency' => 'required|string|max:100',
            'default_language' => 'required|in:fr,en',
        ]);

        $settings = Setting::firstOrCreate([]);
        $settings->update($validated);

        return response()->json([
            'message' => 'Paramètres enregistrés.',
            'data' => $settings,
        ]);
    }
}