<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportProductsRequest;
use App\Imports\ProductsImport;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    /**
     * List all products for the authenticated user.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $products = Product::where('user_id', Auth::id())
                ->select('id', 'user_id', 'name', 'price', 'sku', 'description')
                ->paginate(config('pagination.default_per_page'));

            return response()->json([
                'status' => 'success',
                'message' => 'Products retrieved successfully',
                'data' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch products', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve products. Please try again.',
            ], 500);
        }
    }

    /**
     * Import products from a CSV or Excel file.
     *
     * @param ImportProductsRequest $request
     * @return JsonResponse
     */
    public function import(ImportProductsRequest $request): JsonResponse
    {
        try {
            Excel::import(new ProductsImport(Auth::id()), $request->file('file'));

            return response()->json([
                'status' => 'success',
                'message' => 'Products imported successfully',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Product import failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'file' => $request->file('file')->getClientOriginalName(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Product import failed. Please check the file and try again.',
            ], 500);
        }
    }
}
