<?php

namespace App\Console\Commands;
 
use Illuminate\Console\Command;
use App\Services\RiskAnalysisService;
 
class AnalyzeRisks extends Command
{
    protected $signature   = 'ilima:analyze-risks';
    protected $description = 'Recalcule les scores de risque IA pour tous les étudiants actifs';
 
    public function __construct(private RiskAnalysisService $service)
    {
        parent::__construct();
    }
 
    public function handle(): void
    {
        $this->info('Analyse en cours...');
        $this->service->analyzeAll();
        $this->info('✓ Analyse terminée.');
    }
}