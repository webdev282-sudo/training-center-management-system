<?php
namespace Tests\Feature\AI;
 
use App\Models\{Student, RiskAnalysis};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class RiskAnalysisTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_can_list_risk_analyses(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
        RiskAnalysis::factory()->create(['student_id' => $student->id]);
 
        $this->getJson('/api/v1/ai/risk-analyses')
             ->assertOk()
             ->assertJsonStructure([
                 'data' => [['absenceScore', 'paymentScore', 'riskLevel', 'recommendation']],
             ]);
    }
 
    public function test_can_filter_risk_analyses_by_level(): void
    {
        $this->actingAsAdmin();
 
        $s1 = Student::factory()->create();
        $s2 = Student::factory()->create();
 
        RiskAnalysis::factory()->create(['student_id' => $s1->id, 'risk_level' => 'high',   'total_risk_score' => 80]);
        RiskAnalysis::factory()->create(['student_id' => $s2->id, 'risk_level' => 'low',    'total_risk_score' => 10]);
 
        $this->getJson('/api/v1/ai/risk-analyses?level=high')
             ->assertOk()
             ->assertJsonPath('meta.total', 1);
    }
 
    public function test_can_analyze_individual_student(): void
    {
        $this->actingAsAdmin();
        $student = Student::factory()->create();
 
        $this->postJson("/api/v1/ai/analyze/{$student->id}")
             ->assertOk()
             ->assertJsonStructure([
                 'data' => ['absenceScore', 'paymentScore', 'progressionScore', 'totalRiskScore', 'riskLevel'],
             ]);
 
        $this->assertDatabaseHas('risk_analyses', ['student_id' => $student->id]);
    }
 
    public function test_analyze_all_returns_success_message(): void
    {
        $this->actingAsAdmin();
        Student::factory()->count(3)->create();
 
        $this->postJson('/api/v1/ai/analyze-all')
             ->assertOk()
             ->assertJsonStructure(['message']);
 
        $this->assertDatabaseCount('risk_analyses', 3);
    }
}