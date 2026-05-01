<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCreativeRequest;
use App\Http\Resources\CreativeResource;
use App\Services\CreativeService;
use Illuminate\Http\Request;

class CreativeController extends Controller
{
    public function __construct(
        protected CreativeService $creativeService
    ) {}

    /**
     * Display a listing of the creatives for a campaign.
     */
    public function index(int $id)
    {
        $creatives = $this->creativeService->getCreativesForCampaign($id);

        if (empty($creatives) && ! $this->creativeService->campaignExists($id)) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return CreativeResource::collection($creatives);
    }

    /**
     * Store a newly created creative in storage.
     *
     * @return \Illuminate\Http\JsonResponse 201
     */
    public function store(StoreCreativeRequest $request, int $id)
    {
        $image = $request->file('image') ?: $request->input('image');

        $creative = $this->creativeService->addCreativeToCampaign(
            $id,
            $image
        );

        return (new CreativeResource($creative))
            ->response()
            ->setStatusCode(201);
    }
}
