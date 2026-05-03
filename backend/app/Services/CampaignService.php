<?php

namespace App\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Request;

class CampaignService
{
    /** @var array<int, array<string, mixed>> */
    private array $campaigns = [];

    private string $campaignsFile;

    public function __construct(?string $campaignsFile = null)
    {
        $this->campaignsFile = $campaignsFile ?? base_path('data/campaigns.json');

        $this->loadCampaigns();
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

    /**
     * @param  array{status?: int, q?: string, page?: int, limit?: int}  $filters
     */
    public function getCampaigns(array $filters = []): LengthAwarePaginator
    {
        $campaigns = collect($this->campaigns);

        if (isset($filters['status'])) {
            $campaigns = $campaigns->where('status', (int) $filters['status']);
        }

        if (isset($filters['ids']) && is_array($filters['ids'])) {
            $campaigns = $campaigns->whereIn('id', $filters['ids']);
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

        return new LengthAwarePaginator(
            $results,
            $total,
            $limit,
            $page,
            ['path' => Request::url(), 'query' => Request::query()]
        );
    }

    public function getCampaign(int $id): ?array
    {
        return collect($this->campaigns)->first(fn ($c) => $c['id'] === $id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateCampaign(int $id, array $data): ?array
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
}
