<?php

namespace Tests\Feature\Sessions;
 
use App\Models\Group;
use App\Services\SessionGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class SessionGeneratorTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_generates_sessions_for_correct_days(): void
    {
        $this->actingAsAdmin();
 
        $group = Group::factory()->create([
            'start_date' => '2025-01-06', // Monday
            'end_date'   => '2025-01-19',
            'days'       => ['lundi', 'mercredi'],
            'start_time' => '09:00',
            'end_time'   => '11:00',
        ]);
 
        $created = (new SessionGeneratorService)->generateForGroup($group);
 
        // 2 weeks × 2 days = 4 sessions
        $this->assertEquals(4, $created);
        $this->assertDatabaseCount('sessions', 4);
    }
 
    public function test_generator_is_idempotent(): void
    {
        $group = Group::factory()->create([
            'start_date' => '2025-01-06',
            'end_date'   => '2025-01-12',
            'days'       => ['lundi'],
        ]);
 
        $service = new SessionGeneratorService;
        $service->generateForGroup($group);
        $created = $service->generateForGroup($group); // second call
 
        $this->assertEquals(0, $created); // no new sessions
        $this->assertDatabaseCount('sessions', 1);
    }
 
    public function test_api_generates_sessions_for_group(): void
    {
        $this->actingAsAdmin();
        $group = Group::factory()->create([
            'start_date' => now()->startOfWeek()->toDateString(),
            'end_date'   => now()->endOfWeek()->toDateString(),
            'days'       => ['lundi'],
            'status'     => 'active',
        ]);
 
        $this->postJson("/api/v1/groups/{$group->id}/generate-sessions")
             ->assertOk()
             ->assertJsonStructure(['message', 'data' => ['created']]);
    }
 
    public function test_cannot_generate_sessions_for_completed_group(): void
    {
        $this->actingAsAdmin();
        $group = Group::factory()->create(['status' => 'completed']);
 
        $this->postJson("/api/v1/groups/{$group->id}/generate-sessions")
             ->assertUnprocessable();
    }
}