<?php
// ============================================================
// tests/Unit/Models/PaymentRecalculationTest.php
// ============================================================
namespace Tests\Unit\Models;
 

use App\Models\{Payment, Installment, Enrollment};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class PaymentRecalculationTest extends TestCase
{
    use RefreshDatabase;
 
    public function test_payment_recalculates_on_installment_save(): void
    {
        $enrollment = Enrollment::factory()->create();
        $payment    = Payment::factory()->create([
            'student_id'     => $enrollment->student_id,
            'enrollment_id'  => $enrollment->id,
            'total_amount'   => 18000,
            'paid_amount'    => 0,
            'payment_status' => 'pending',
        ]);
 
        Installment::create([
            'payment_id' => $payment->id,
            'amount'     => 9000,
            'due_date'   => now()->toDateString(),
            'paid_date'  => now()->toDateString(),
            'status'     => 'paid',
            'method'     => 'cash',
        ]);
 
        $payment->refresh();
 
        $this->assertEquals(9000, $payment->paid_amount);
        $this->assertEquals('partial', $payment->payment_status);
    }
 
    public function test_payment_marked_paid_when_fully_settled(): void
    {
        $enrollment = Enrollment::factory()->create();
        $payment    = Payment::factory()->create([
            'student_id'    => $enrollment->student_id,
            'enrollment_id' => $enrollment->id,
            'total_amount'  => 12000,
            'paid_amount'   => 0,
            'payment_status'=> 'pending',
        ]);
 
        Installment::create([
            'payment_id' => $payment->id,
            'amount'     => 12000,
            'due_date'   => now()->toDateString(),
            'paid_date'  => now()->toDateString(),
            'status'     => 'paid',
            'method'     => 'cash',
        ]);
 
        $payment->refresh();
 
        $this->assertEquals('paid', $payment->payment_status);
        $this->assertEquals(0, (float) $payment->remaining_amount);
    }
}