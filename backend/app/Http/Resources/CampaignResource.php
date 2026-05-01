<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'name' => $this->resource['name'],
            'status' => $this->resource['status'],
            'landingUrl' => $this->resource['landingUrl'] ?? null,
            'coverImageUrl' => $this->resource['coverImageUrl'] ?? null,
            'createdAt' => $this->resource['createdAt'],
        ];
    }
}
