<?php

namespace App\Providers;
 
use App\Models\{Student, Enrollment};
use App\Observers\{StudentObserver, EnrollmentObserver};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
 
class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register model observers
        Student::observe(StudentObserver::class);
        Enrollment::observe(EnrollmentObserver::class);
 
        // Prevent lazy loading in development (N+1 detection)
        Model::preventLazyLoading(! app()->isProduction());
 
        // Force HTTPS in production
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
