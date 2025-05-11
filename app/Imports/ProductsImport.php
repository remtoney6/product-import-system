<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @var int The ID of the authenticated user
     */
    protected $userId;

    /**
     * ProductsImport constructor.
     *
     * @param int $userId The ID of the authenticated user
     */
    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    /**
     * Transform a row into a Product model.
     *
     * @param array $row
     * @return Product|null
     */
    public function model(array $row): ?Product
    {
        try {
            return new Product([
                'user_id' => $this->userId,
                'name' => $row['name'],
                'price' => $row['price'],
                'sku' => $row['sku'],
                'description' => $row['description'],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to import product row', [
                'error' => $e->getMessage(),
                'row' => $row,
                'user_id' => $this->userId,
            ]);

            return null; // Skip invalid rows
        }
    }

    /**
     * Define validation rules for each row.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Handle a failed validation attempt for a row.
     *
     * @param \Illuminate\Validation\ValidationException $exception
     * @return void
     */
    public function onFailure(\Illuminate\Validation\ValidationException $exception): void
    {
        Log::warning('Product row validation failed', [
            'errors' => $exception->errors(),
            'row' => $exception->getData(),
            'user_id' => $this->userId,
        ]);
    }
}