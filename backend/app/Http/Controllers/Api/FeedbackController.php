<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * GET /api/feedback
     * Lister les feedbacks du user connecté (paginé).
     */
    public function index(Request $request): JsonResponse
    {
        $feedback = Feedback::forUser($request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json($feedback);
    }

    /**
     * POST /api/feedback
     * Créer un nouveau feedback.
     */
    public function store(StoreFeedbackRequest $request): JsonResponse
    {
        $feedback = Feedback::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message'  => 'Feedback created successfully.',
            'feedback' => $feedback,
        ], 201);
    }

    /**
     * PUT /api/feedback/{id}
     * Modifier un feedback (owner seulement).
     */
    public function update(UpdateFeedbackRequest $request, Feedback $feedback): JsonResponse
    {
        $this->authorize('update', $feedback);

        $feedback->update($request->validated());

        return response()->json([
            'message'  => 'Feedback updated successfully.',
            'feedback' => $feedback->fresh(),
        ]);
    }

    /**
     * DELETE /api/feedback/{id}
     * Supprimer un feedback (owner seulement).
     */
    public function destroy(Request $request, Feedback $feedback): JsonResponse
    {
        $this->authorize('delete', $feedback);

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully.',
        ]);
    }

    /**
     * GET /api/feedback/stats
     * Statistiques pour le dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Totaux
        $total    = Feedback::forUser($userId)->count();
        $positive = Feedback::forUser($userId)->positive()->count();
        $negative = Feedback::forUser($userId)->negative()->count();
        $neutral  = $total - $positive - $negative;
        $average  = Feedback::forUser($userId)->avg('rating');

        // Par source
        $bySource = Feedback::forUser($userId)
            ->selectRaw('source, COUNT(*) as count')
            ->groupBy('source')
            ->pluck('count', 'source');

        // Par rating (1, 2, 3, 4, 5)
        $byRating = Feedback::forUser($userId)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating')
            ->pluck('count', 'rating');

        // Par mois (6 derniers mois)
        $byMonth = Feedback::forUser($userId)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        // 5 derniers feedbacks
        $latest = Feedback::forUser($userId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_count'    => $total,
            'positive_count' => $positive,
            'negative_count' => $negative,
            'neutral_count'  => $neutral,
            'average_rating' => round((float) $average, 2),
            'by_source'      => $bySource,
            'by_rating'      => $byRating,
            'by_month'       => $byMonth,
            'latest'         => $latest,
        ]);
    }
}