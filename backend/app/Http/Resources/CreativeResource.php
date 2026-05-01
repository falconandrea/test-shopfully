<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreativeResource extends JsonResource
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
            'campaignId' => $this->resource['campaignId'],
            'assetUrl' => $this->resource['assetUrl'],
            'createdAt' => $this->resource['createdAt'],
        ];
    }
}
