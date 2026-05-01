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
        // TODO: Register CampaignService singleton here for the data layer
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
