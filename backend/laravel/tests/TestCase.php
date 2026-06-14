<?php

namespace Tests;
 
use App\Models\Admin;
use Illuminate\Foundation\Testing\{RefreshDatabase, TestCase as BaseTestCase};
use Laravel\Sanctum\Sanctum;
 
abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;
 
    /**
     * Authenticate as a super admin and return the instance.
     */
    protected function actingAsSuperAdmin(): Admin
    {
        $admin = Admin::factory()->create(['role' => 'super_admin']);
        Sanctum::actingAs($admin);
        return $admin;
    }
 
    /**
     * Authenticate as a regular admin.
     */
    protected function actingAsAdmin(): Admin
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);
        return $admin;
    }
 
    /**
     * Assert the standard paginated response structure.
     */
    protected function assertPaginatedResponse($response, ?int $expectedTotal = null): void
    {
        $response->assertJsonStructure([
            'data',
            'meta' => ['total'],
        ]);
 
        if ($expectedTotal !== null) {
            $response->assertJsonPath('meta.total', $expectedTotal);
        }
    }
}
