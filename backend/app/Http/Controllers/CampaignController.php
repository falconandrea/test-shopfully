<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCampaignRequest;
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
    public function show(int $id)
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
    public function update(UpdateCampaignRequest $request, int $id)
    {
        // RB6 — id is required in the PUT body and must match the URL parameter.
        if ($request->input('id') !== $id) {
            return response()->json([
                'message' => 'The ID in the body must match the ID in the URL.',
                'errors' => ['id' => ['Mismatch between URL and body ID.']]
            ], 422);
        }

        $campaign = $this->campaignService->updateCampaign($id, $request->validated());

        if (! $campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return new CampaignResource($campaign);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Out of scope for now
    }
}
