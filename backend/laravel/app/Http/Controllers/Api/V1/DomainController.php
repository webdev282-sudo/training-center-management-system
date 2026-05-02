<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\{JsonResponse, Request};

class DomainController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $domains = \App\Models\Domain::query()
            ->withCount('courses')
            ->when($request->status, fn($q, $s) => $q->where('status', (bool) $s))
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => \App\Http\Resources\DomainResource::collection($domains),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:domains,name',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $domain = \App\Models\Domain::create($validated);

        return response()->json([
            'data' => new \App\Http\Resources\DomainResource($domain),
        ], 201);
    }

    public function show(\App\Models\Domain $domain): JsonResponse
    {
        $domain->load(['courses' => fn($q) => $q->where('status', true)]);

        return response()->json([
            'data' => new \App\Http\Resources\DomainResource($domain),
        ]);
    }

    public function update(Request $request, \App\Models\Domain $domain): JsonResponse
    {
        $validated = $request->validate([
            'name' => "required|string|max:100|unique:domains,name,{$domain->id}",
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $domain->update($validated);

        return response()->json([
            'data' => new \App\Http\Resources\DomainResource($domain),
        ]);
    }

    public function destroy(\App\Models\Domain $domain): JsonResponse
    {
        if ($domain->courses()->exists()) {
            return response()->json([
                'errors' => ['Impossible de supprimer un domaine contenant des cours.'],
            ], 422);
        }

        $domain->delete();

        return response()->json(null, 204);
    }
}