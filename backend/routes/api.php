<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FeedbackController;
use Illuminate\Support\Facades\Route;

// ── Routes publiques ───────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Routes protégées (token obligatoire) ───────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    // Dashboard stats (AVANT apiResource pour éviter conflit)
    Route::get('/feedback/stats', [FeedbackController::class, 'stats']);

    // Feedback CRUD
    Route::apiResource('feedback', FeedbackController::class)
        ->except(['show']);
});