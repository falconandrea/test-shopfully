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
        $campaigns = collect($this->campaignService->getCampaigns());

        // Filter by status
        if ($request->has('status')) {
            $status = (int) $request->query('status');
            $campaigns = $campaigns->where('status', $status);
        }

        // Filter by q (search by id or name, case-insensitive)
        if ($request->has('q')) {
            $query = strtolower($request->query('q'));
            $campaigns = $campaigns->filter(function ($campaign) use ($query) {
                return str_contains(strtolower((string) $campaign['id']), $query) ||
                       str_contains(strtolower((string) $campaign['name']), $query);
            });
        }

        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $total = $campaigns->count();

        $results = $campaigns->forPage($page, $limit)->values();

        return CampaignResource::collection($results)->additional([
            'meta' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'last_page' => (int) ceil($total / $limit),
            ]
        ]);
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
