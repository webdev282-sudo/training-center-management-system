<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MarkOverduePayments extends Command
{
    protected $signature   = 'ilima:mark-overdue';
    protected $description = 'Marque les paiements dépassant la date d\'échéance comme "overdue"';
 
    public function handle(): void
    {
        $updated = \App\Models\Payment::query()
            ->whereIn('payment_status', ['pending', 'partial'])
            ->whereDate('due_date', '<', today())
            ->update(['payment_status' => 'overdue']);
 
        // Same for installments
        \App\Models\Installment::query()
            ->where('status', 'pending')
            ->whereDate('due_date', '<', today())
            ->update(['status' => 'overdue']);
 
        $this->info("✓ {$updated} paiements marqués en retard.");
    }
}
 
// ============================================================
// bootstrap/app.php  (Schedule registration — Laravel 11)
// ============================================================
// In your bootstrap/app.php withSchedule() callback, add:
//
// ->withSchedule(function (Illuminate\Console\Scheduling\Schedule $schedule) {
//     $schedule->command('ilima:mark-overdue')->dailyAt('00:05');
//     $schedule->command('ilima:analyze-risks')->weeklyOn(1, '06:00'); // every Monday
// })