<?php


namespace Tests\Feature\Payments;
 
use App\Models\{Student, Payment, Enrollment, Group, Installment};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class PaymentTest extends TestCase
{
    use RefreshDatabase;
 
    private function makePayment(float $total = 18000, float $paid = 0, string $status = 'pending'): Payment
    {
        $enrollment = Enrollment::factory()->create();
        return Payment::factory()->create([
            'student_id'     => $enrollment->student_id,
            'enrollment_id'  => $enrollment->id,
            'total_amount'   => $total,
            'paid_amount'    => $paid,
            'payment_status' => $status,
        ]);
    }
 
    public function test_can_list_payments(): void
    {
        $this->actingAsAdmin();
        $this->makePayment();
        $this->makePayment();
 
        $this->getJson('/api/v1/payments')
             ->assertOk()
             ->assertJsonStructure(['data', 'meta']);
    }
 
    public function test_can_filter_payments_by_status(): void
    {
        $this->actingAsAdmin();
        $this->makePayment(18000, 0, 'pending');
        $this->makePayment(18000, 0, 'overdue');
        $this->makePayment(18000, 18000, 'paid');
 
        $this->getJson('/api/v1/payments?status=overdue')
             ->assertOk()
             ->assertJsonPath('meta.total', 1);
    }
 
    public function test_can_add_installment_to_payment(): void
    {
        $this->actingAsAdmin();
        $payment = $this->makePayment(18000, 0, 'pending');
 
        $response = $this->postJson("/api/v1/payments/{$payment->id}/installments", [
            'amount'   => 9000,
            'due_date' => now()->toDateString(),
            'note'     => 'Premier versement',
        ]);
 
        $response->assertCreated();
 
        // Payment recalculated
        $payment->refresh();
        $this->assertEquals(9000, $payment->paid_amount);
        $this->assertEquals('partial', $payment->payment_status);
    }
 
    public function test_installment_cannot_exceed_remaining_amount(): void
    {
        $this->actingAsAdmin();
        $payment = $this->makePayment(18000, 15000, 'partial');
 
        $this->postJson("/api/v1/payments/{$payment->id}/installments", [
            'amount'   => 9000, // more than 3000 remaining
            'due_date' => now()->toDateString(),
        ])->assertUnprocessable();
    }
 
    public function test_payment_marked_as_paid_when_fully_settled(): void
    {
        $this->actingAsAdmin();
        $payment = $this->makePayment(12000, 0, 'pending');
 
        $this->postJson("/api/v1/payments/{$payment->id}/installments", [
            'amount'   => 12000,
            'due_date' => now()->toDateString(),
        ])->assertCreated();
 
        $payment->refresh();
        $this->assertEquals('paid', $payment->payment_status);
        $this->assertEquals(0, $payment->remaining_amount);
    }
}