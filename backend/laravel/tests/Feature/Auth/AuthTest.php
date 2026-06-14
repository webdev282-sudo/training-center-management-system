<?php
namespace Tests\Feature\Auth;
 
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
 
class AuthTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_admin_can_login_with_valid_credentials(): void
    {
        Admin::factory()->create([
            'email'    => 'admin@ilima.dz',
            'password' => Hash::make('password'),
        ]);
 
        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => 'admin@ilima.dz',
            'password' => 'password',
        ]);
 
        $response->assertOk()
                 ->assertJsonStructure([
                     'data' => ['token', 'admin' => ['id', 'name', 'email', 'role']],
                 ]);
    }
 
    public function test_login_fails_with_wrong_password(): void
    {
        Admin::factory()->create(['email' => 'admin@ilima.dz']);
 
        $this->postJson('/api/v1/auth/login', [
            'email'    => 'admin@ilima.dz',
            'password' => 'wrong-password',
        ])->assertUnprocessable()
          ->assertJsonPath('errors.email.0', 'Identifiants incorrects.');
    }
 
    public function test_login_requires_email_and_password(): void
    {
        $this->postJson('/api/v1/auth/login', [])
             ->assertUnprocessable()
             ->assertJsonValidationErrors(['email', 'password']);
    }
 
    public function test_authenticated_admin_can_logout(): void
    {
        $this->actingAsAdmin();
 
        $this->postJson('/api/v1/auth/logout')
             ->assertOk()
             ->assertJsonPath('message', 'Déconnecté.');
    }
 
    public function test_protected_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/students')
             ->assertUnauthorized();
    }
}