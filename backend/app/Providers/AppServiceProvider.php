<?php

namespace App\Providers;

use App\Services\CampaignService;
use App\Services\CreativeService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CampaignService::class, function ($app) {
            return new CampaignService;
        });

        $this->app->singleton(CreativeService::class, function ($app) {
            return new CreativeService($app->make(CampaignService::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
