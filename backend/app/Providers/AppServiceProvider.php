<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\CampaignService::class, function ($app) {
            return new \App\Services\CampaignService();
        });

        $this->app->singleton(\App\Services\CreativeService::class, function ($app) {
            return new \App\Services\CreativeService($app->make(\App\Services\CampaignService::class));
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
