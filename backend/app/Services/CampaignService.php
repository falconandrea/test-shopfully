<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CampaignService
{
    /** @var array<int, array<string, mixed>> */
    private array $campaigns = [];

    /** @var array<int, array<string, mixed>> */
    private array $creatives = [];

    private string $campaignsFile;
    private string $creativesFile;

    public function __construct()
    {
        $this->campaignsFile = base_path('data/campaigns.json');
        $this->creativesFile = storage_path('app/creatives.json');

        $this->loadCampaigns();
        $this->loadCreatives();
    }

    private function loadCampaigns(): void
    {
        if (File::exists($this->campaignsFile)) {
            $this->campaigns = json_decode(File::get($this->campaignsFile), true) ?? [];
        }
    }

    private function saveCampaigns(): void
    {
        File::put($this->campaignsFile, json_encode($this->campaigns, JSON_PRETTY_PRINT));
    }

    private function loadCreatives(): void
    {
        if (File::exists($this->creativesFile)) {
            $this->creatives = json_decode(File::get($this->creativesFile), true) ?? [];
        }
    }

    private function saveCreatives(): void
    {
        File::put($this->creativesFile, json_encode($this->creatives, JSON_PRETTY_PRINT));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCampaigns(): array
    {
        return $this->campaigns;
    }

    public function getCampaign(string $id): ?array
    {
        return collect($this->campaigns)->firstWhere('id', $id);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function updateCampaign(string $id, array $data): ?array
    {
        $index = collect($this->campaigns)->search(fn ($c) => $c['id'] === $id);

        if ($index === false) {
            return null;
        }

        // Merge updated fields
        $this->campaigns[$index] = array_merge($this->campaigns[$index], $data);
        $this->saveCampaigns();

        return $this->campaigns[$index];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCreatives(string $campaignId): array
    {
        return collect($this->creatives)->where('campaignId', $campaignId)->values()->all();
    }

    /**
     * @param array<string, mixed> $data
     */
    public function addCreative(string $campaignId, array $data): array
    {
        $creative = [
            'id' => (string) Str::uuid(),
            'campaignId' => $campaignId,
            'assetUrl' => $data['assetUrl'],
            'createdAt' => now()->toIso8601String(),
        ];

        $this->creatives[] = $creative;
        $this->saveCreatives();

        return $creative;
    }
}
