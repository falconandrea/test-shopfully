<?php

namespace App\Http\Controllers;

use App\Http\Resources\CampaignResource;
use App\Services\CampaignService;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function __construct(
        protected CampaignService $campaignService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $paginatedCampaigns = $this->campaignService->getCampaigns(
            $request->only(['status', 'q', 'page', 'limit'])
        );

        return CampaignResource::collection($paginatedCampaigns);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $campaign = $this->campaignService->getCampaign($id);

        if (! $campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return new CampaignResource($campaign);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // To be implemented in Task 5
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Out of scope for now
    }
}
