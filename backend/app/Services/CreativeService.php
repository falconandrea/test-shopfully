<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreativeService
{
    /** @var array<int, array<string, mixed>> */
    private array $creatives = [];

    private string $creativesFile;

    public function __construct(
        protected CampaignService $campaignService,
        ?string $creativesFile = null,
    ) {
        $this->creativesFile = $creativesFile ?? storage_path('app/creatives.json');
        $this->loadCreatives();
    }

    private function loadCreatives(): void
    {
        if (File::exists($this->creativesFile)) {
            $this->creatives = json_decode(File::get($this->creativesFile), true) ?? [];
        }
    }

    private function saveCreatives(): void
    {
        // Ensure the directory exists
        $dir = dirname($this->creativesFile);
        if (! File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($this->creativesFile, json_encode($this->creatives, JSON_PRETTY_PRINT));
    }

    public function campaignExists(int $campaignId): bool
    {
        return $this->campaignService->getCampaign($campaignId) !== null;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCreativesForCampaign(int $campaignId): array
    {
        return collect($this->creatives)
            ->filter(fn ($c) => (int) $c['campaignId'] === $campaignId)
            ->values()
            ->all();
    }

    /**
     * @param  UploadedFile|string  $file
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function addCreativeToCampaign(int $campaignId, mixed $file): array
    {
        $campaign = $this->campaignService->getCampaign($campaignId);

        if (! $campaign) {
            throw ValidationException::withMessages([
                'campaign' => ['Campaign not found.'],
            ]);
        }

        // RB11 — Creatives cannot be added if the campaign is paused.
        if ((int) $campaign['status'] !== 1) {
            throw ValidationException::withMessages([
                'campaign' => ['Creatives cannot be added to a paused campaign.'],
            ]);
        }

        // RB7 — A campaign can have a maximum of 3 creatives.
        $existingCount = count($this->getCreativesForCampaign($campaignId));
        if ($existingCount >= 3) {
            throw ValidationException::withMessages([
                'campaign' => ['Maximum limit of 3 creatives reached for this campaign.'],
            ]);
        }

        $url = '';

        if ($file instanceof UploadedFile) {
            // Handle regular file upload
            $path = $file->store('creatives', 'public');
            $url = Storage::disk('public')->url($path);
        } elseif (is_string($file)) {
            // Handle base64 upload
            preg_match('/^data:image\/(\w+);base64,/', $file, $matches);
            $extension = $matches[1] ?? 'png';
            $data = base64_decode(substr($file, strpos($file, ',') + 1));

            $filename = 'creatives/' . Str::uuid() . '.' . $extension;
            Storage::disk('public')->put($filename, $data);
            $url = Storage::disk('public')->url($filename);
        }

        $creative = [
            'id' => (string) Str::uuid(),
            'campaignId' => $campaignId,
            'assetUrl' => $url,
            'createdAt' => now()->toIso8601String(),
        ];

        $this->creatives[] = $creative;
        $this->saveCreatives();

        return $creative;
    }
}
