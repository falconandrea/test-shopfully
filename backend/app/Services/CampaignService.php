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
     * @param array{status?: int, q?: string, page?: int, limit?: int} $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getCampaigns(array $filters = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $campaigns = collect($this->campaigns);

        if (isset($filters['status'])) {
            $campaigns = $campaigns->where('status', (int) $filters['status']);
        }

        if (isset($filters['q'])) {
            $query = strtolower((string) $filters['q']);
            $campaigns = $campaigns->filter(function ($campaign) use ($query) {
                return str_contains(strtolower((string) $campaign['id']), $query) ||
                       str_contains(strtolower((string) $campaign['name']), $query);
            });
        }

        $total = $campaigns->count();
        $page = (int) ($filters['page'] ?? 1);
        $limit = (int) ($filters['limit'] ?? 10);

        $results = $campaigns->forPage($page, $limit)->values();

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $results,
            $total,
            $limit,
            $page,
            ['path' => \Illuminate\Support\Facades\Request::url(), 'query' => \Illuminate\Support\Facades\Request::query()]
        );
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
