<?php

use App\Services\CampaignService;
use App\Services\CreativeService;

/**
 * Set up isolated services for every test, using temp JSON files
 * so the real data fixtures are never touched.
 */
beforeEach(function () {
    // Create a temp campaigns fixture with known data
    $this->campaignsFile = tempnam(sys_get_temp_dir(), 'campaigns_') . '.json';
    $this->creativesFile = tempnam(sys_get_temp_dir(), 'creatives_') . '.json';

    $campaigns = [
        [
            'id' => 1,
            'name' => 'Active Campaign',
            'status' => 1,
            'landingUrl' => 'https://example.com/active',
            'coverImageUrl' => 'https://example.com/images/active.jpg',
            'createdAt' => '2026-01-01 00:00:00',
        ],
        [
            'id' => 2,
            'name' => 'Paused Campaign',
            'status' => 0,
            'landingUrl' => 'https://example.com/paused',
            'coverImageUrl' => 'https://example.com/images/paused.jpg',
            'createdAt' => '2026-01-02 00:00:00',
        ],
    ];

    file_put_contents($this->campaignsFile, json_encode($campaigns));
    file_put_contents($this->creativesFile, json_encode([]));

    // Rebind services as singletons with temp file paths
    $this->app->singleton(CampaignService::class, function () {
        return new CampaignService($this->campaignsFile);
    });

    $this->app->singleton(CreativeService::class, function ($app) {
        return new CreativeService(
            $app->make(CampaignService::class),
            $this->creativesFile,
        );
    });
});

afterEach(function () {
    @unlink($this->campaignsFile);
    @unlink($this->creativesFile);
});

// ─────────────────────────────────────────────────────────
//  Campaign Listing — RA1, RA2
// ─────────────────────────────────────────────────────────

it('returns a paginated list of campaigns', function () {
    $response = $this->getJson('/api/campaigns');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'name', 'status', 'landingUrl', 'coverImageUrl', 'createdAt']],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
});

it('filters campaigns by status', function () {
    $response = $this->getJson('/api/campaigns?status=1');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Active Campaign');
});

it('filters campaigns by search query', function () {
    $response = $this->getJson('/api/campaigns?q=paused');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Paused Campaign');
});

// ─────────────────────────────────────────────────────────
//  Single Campaign — RA3
// ─────────────────────────────────────────────────────────

it('returns a single campaign by id', function () {
    $response = $this->getJson('/api/campaigns/1');

    $response->assertOk()
        ->assertJsonPath('data.id', 1)
        ->assertJsonPath('data.name', 'Active Campaign');
});

it('returns 404 for a non-existent campaign', function () {
    $response = $this->getJson('/api/campaigns/999');

    $response->assertNotFound();
});

// ─────────────────────────────────────────────────────────
//  Update Campaign — RA4, RB4, RB5, RB6
// ─────────────────────────────────────────────────────────

it('updates a campaign with valid data', function () {
    $response = $this->putJson('/api/campaigns/1', [
        'id' => 1,
        'name' => 'Updated Name',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Name');
});

it('rejects update when body id does not match url id — RB6', function () {
    $response = $this->putJson('/api/campaigns/1', [
        'id' => 2,
        'name' => 'Mismatch',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['id']);
});

it('rejects invalid status value — RB5', function () {
    $response = $this->putJson('/api/campaigns/1', [
        'id' => 1,
        'status' => 5,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['status']);
});

it('rejects invalid landing url — RB4', function () {
    $response = $this->putJson('/api/campaigns/1', [
        'id' => 1,
        'landingUrl' => 'not-a-url',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['landingUrl']);
});

it('returns 404 when updating a non-existent campaign', function () {
    $response = $this->putJson('/api/campaigns/999', [
        'id' => 999,
        'name' => 'Ghost',
    ]);

    $response->assertNotFound();
});
