<?php

use App\Http\Controllers\CampaignController;
use Illuminate\Support\Facades\Route;

Route::prefix('campaigns')->group(function () {
    // RA1, RA2 — Campaign list with pagination and filters
    Route::get('/', [CampaignController::class, 'index']);

    // RA3 — Single campaign
    Route::get('/{id}', [CampaignController::class, 'show']);

    // RA4 — Update campaign
    Route::put('/{id}', [CampaignController::class, 'update']);

    // RA5 — List creatives for a campaign
    Route::get('/{id}/creatives', static function (string $id) {
        return response()->json([]);
    });

    // RA6 — Upload a new creative
    Route::post('/{id}/creatives', static function (string $id) {
        return response()->json([], 201);
    });
});
