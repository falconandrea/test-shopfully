<?php

use App\Services\CampaignService;
use App\Services\CreativeService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Set up isolated services for every test, using temp JSON files
 * so the real data fixtures are never touched.
 */
beforeEach(function () {
    Storage::fake('public');

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

/**
 * Helper: create a valid 320×480 PNG UploadedFile.
 */
function validCreativeImage(): UploadedFile
{
    $img = imagecreatetruecolor(320, 480);
    ob_start();
    imagepng($img);
    $data = ob_get_clean();

    $tmpPath = tempnam(sys_get_temp_dir(), 'img_') . '.png';
    file_put_contents($tmpPath, $data);

    return new UploadedFile($tmpPath, 'creative.png', 'image/png', null, true);
}

/**
 * Helper: create a valid 320×480 PNG base64 string.
 */
function validCreativeBase64(): string
{
    $img = imagecreatetruecolor(320, 480);
    ob_start();
    imagepng($img);
    $data = ob_get_clean();

    return 'data:image/png;base64,' . base64_encode($data);
}

/**
 * Helper: create an invalid-dimension image (100×100).
 */
function invalidDimensionImage(): UploadedFile
{
    $img = imagecreatetruecolor(100, 100);
    ob_start();
    imagepng($img);
    $data = ob_get_clean();

    $tmpPath = tempnam(sys_get_temp_dir(), 'img_') . '.png';
    file_put_contents($tmpPath, $data);

    return new UploadedFile($tmpPath, 'bad.png', 'image/png', null, true);
}

// ─────────────────────────────────────────────────────────
//  List Creatives — RA5
// ─────────────────────────────────────────────────────────

it('returns an empty list when campaign has no creatives', function () {
    $response = $this->getJson('/api/campaigns/1/creatives');

    $response->assertOk()
        ->assertJsonCount(0, 'data');
});

it('returns 404 when listing creatives for a non-existent campaign', function () {
    $response = $this->getJson('/api/campaigns/999/creatives');

    $response->assertNotFound();
});

// ─────────────────────────────────────────────────────────
//  Upload Creative (file) — RA6, RB3
// ─────────────────────────────────────────────────────────

it('uploads a creative via file to an active campaign', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => validCreativeImage(),
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['data' => ['id', 'campaignId', 'assetUrl', 'createdAt']]);

    Storage::disk('public')->assertExists('creatives/' . basename(
        $response->json('data.assetUrl')
    ));
});

// ─────────────────────────────────────────────────────────
//  Upload Creative (base64) — RA6
// ─────────────────────────────────────────────────────────

it('uploads a creative via base64 to an active campaign', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => validCreativeBase64(),
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['data' => ['id', 'campaignId', 'assetUrl', 'createdAt']]);
});

// ─────────────────────────────────────────────────────────
//  Business Rule: paused campaign — RB1
// ─────────────────────────────────────────────────────────

it('rejects creative upload on a paused campaign — RB1', function () {
    $response = $this->postJson('/api/campaigns/2/creatives', [
        'image' => validCreativeImage(),
    ]);

    $response->assertUnprocessable()
        ->assertJsonFragment(['Creatives cannot be added to a paused campaign.']);
});

// ─────────────────────────────────────────────────────────
//  Business Rule: max 3 creatives — RB2
// ─────────────────────────────────────────────────────────

it('rejects the 4th creative upload — RB2', function () {
    // Upload 3 creatives
    for ($i = 0; $i < 3; $i++) {
        $this->postJson('/api/campaigns/1/creatives', [
            'image' => validCreativeImage(),
        ])->assertCreated();
    }

    // 4th should fail
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => validCreativeImage(),
    ]);

    $response->assertUnprocessable()
        ->assertJsonFragment(['Maximum limit of 3 creatives reached for this campaign.']);
});

// ─────────────────────────────────────────────────────────
//  Business Rule: image dimensions — RB3
// ─────────────────────────────────────────────────────────

it('rejects an image with wrong dimensions — RB3', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => invalidDimensionImage(),
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['image']);
});

it('rejects an invalid base64 string — RB3', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => 'data:image/gif;base64,R0lGODlhAQABAIAAAA==',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['image']);
});

it('rejects a non-image string — RB3', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => 'just-a-random-string',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['image']);
});

// ─────────────────────────────────────────────────────────
//  Missing image field
// ─────────────────────────────────────────────────────────

it('rejects a request without the image field', function () {
    $response = $this->postJson('/api/campaigns/1/creatives', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['image']);
});

// ─────────────────────────────────────────────────────────
//  Upload to non-existent campaign
// ─────────────────────────────────────────────────────────

it('rejects creative upload on a non-existent campaign', function () {
    $response = $this->postJson('/api/campaigns/999/creatives', [
        'image' => validCreativeImage(),
    ]);

    $response->assertUnprocessable()
        ->assertJsonFragment(['Campaign not found.']);
});

// ─────────────────────────────────────────────────────────
//  Base64 with valid format but wrong dimensions — RB3
// ─────────────────────────────────────────────────────────

it('rejects a base64 image with wrong dimensions — RB3', function () {
    $img = imagecreatetruecolor(100, 100);
    ob_start();
    imagepng($img);
    $data = ob_get_clean();

    $base64 = 'data:image/png;base64,' . base64_encode($data);

    $response = $this->postJson('/api/campaigns/1/creatives', [
        'image' => $base64,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['image']);
});
