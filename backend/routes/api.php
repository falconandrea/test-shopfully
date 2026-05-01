<?php

use Illuminate\Support\Facades\Route;

// RA1, RA2 — Campaign list with pagination and filters
Route::get('/campaigns', static function () {
    return response()->json([]);
});

// RA3 — Single campaign
Route::get('/campaigns/{id}', static function (string $id) {
    return response()->json([]);
});

// RA4 — Update campaign
Route::put('/campaigns/{id}', static function (string $id) {
    return response()->json([]);
});

// RA5 — List creatives for a campaign
Route::get('/campaigns/{id}/creatives', static function (string $id) {
    return response()->json([]);
});

// RA6 — Upload a new creative
Route::post('/campaigns/{id}/creatives', static function (string $id) {
    return response()->json([], 201);
});
