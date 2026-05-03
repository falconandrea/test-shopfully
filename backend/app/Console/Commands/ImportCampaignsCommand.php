<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportCampaignsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-campaigns {--file=../campaigns_data_2026.csv : The path to the CSV file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import campaigns from a CSV file to the JSON fixture';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = base_path($this->option('file'));

        if (! File::exists($filePath)) {
            $this->error("The file {$filePath} does not exist.");

            return Command::FAILURE;
        }

        $this->info("Reading CSV from {$filePath}...");

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file, 0, ';');

        if (! $header) {
            $this->error('Failed to read the CSV header.');

            return Command::FAILURE;
        }

        // Expected header check
        $expectedHeader = ['id', 'name', 'status', 'landingUrl', 'coverImageUrl', 'createdAt'];
        if ($header !== $expectedHeader) {
            $this->error('Invalid CSV format. Expected: ' . implode(';', $expectedHeader));

            return Command::FAILURE;
        }

        $campaigns = [];
        $count = 0;

        while (($row = fgetcsv($file, 0, ';')) !== false) {
            if (count($row) !== count($header)) {
                $this->warn('Skipping row with invalid column count: ' . implode(';', $row));

                continue;
            }

            $data = array_combine($header, $row);

            $campaigns[] = [
                'id' => (int) $data['id'],
                'name' => $data['name'],
                'status' => (int) $data['status'],
                'landingUrl' => $data['landingUrl'],
                'coverImageUrl' => $data['coverImageUrl'],
                'createdAt' => $data['createdAt'],
            ];

            $count++;
        }

        fclose($file);

        $jsonPath = storage_path('app/campaigns.json');
        $jsonDir = dirname($jsonPath);

        if (! File::exists($jsonDir)) {
            File::makeDirectory($jsonDir, 0755, true);
        }

        File::put($jsonPath, json_encode($campaigns, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->info("Successfully imported {$count} campaigns into data/campaigns.json");

        return Command::SUCCESS;
    }
}
