<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FeedbackController extends Controller
{
    /*=========
     * GET /api/feedback
     * Admin: all feedback (filterable by owner_id).
     * Owner: only their own.
     ==========*/
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::query();

        if ($request->user()->isAdmin()) {
            /*====== Admin peut filtrer par owner =======   */
            if ($request->has('owner_id')) {
                $query->where('user_id', $request->owner_id);
            }
        } else {
            /*======== Owner voit que ses données ========*/
            $query->where('user_id', $request->user()->id);
        }

        $feedback = $query->latest()->paginate(15);

        return response()->json($feedback);
    }

    /*=====
     * POST /api/feedback
     ======*/
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

    /*====
     * PUT /api/feedback/{feedback}
     ========*/
    public function update(UpdateFeedbackRequest $request, Feedback $feedback): JsonResponse
    {
        $this->authorize('update', $feedback);

        $feedback->update($request->validated());

        return response()->json([
            'message'  => 'Feedback updated successfully.',
            'feedback' => $feedback->fresh(),
        ]);
    }

    /*=======
     * DELETE /api/feedback/{feedback}
     =======*/
    public function destroy(Request $request, Feedback $feedback): JsonResponse
    {
        $this->authorize('delete', $feedback);

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully.',
        ]);
    }

    /*======
     * GET /api/feedback/stats
     * Admin: all data (filterable by owner_id).
     * Owner: only their own.
     =========*/
    public function stats(Request $request): JsonResponse
    {
        $query = Feedback::query();

        if ($request->user()->isAdmin()) {
            if ($request->has('owner_id')) {
                $query->where('user_id', $request->owner_id);
            }
            
        } else {
            $query->where('user_id', $request->user()->id);
        }

        $total    = (clone $query)->count();
        $positive = (clone $query)->where('rating', '>=', 4)->count();
        $negative = (clone $query)->where('rating', '<=', 2)->count();
        $neutral  = $total - $positive - $negative;
        $average  = (clone $query)->avg('rating');

        $bySource = (clone $query)
            ->selectRaw('source, COUNT(*) as count')
            ->groupBy('source')
            ->pluck('count', 'source');

        $byRating = (clone $query)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating')
            ->pluck('count', 'rating');

        $byMonth = (clone $query)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $latest = (clone $query)->latest()->take(5)->get();

        
        $owners = [];
        if ($request->user()->isAdmin()) {
            $owners = User::select('id', 'name', 'email')
                ->withCount('feedback')
                ->having('feedback_count', '>', 0)
                ->orderBy('name')
                ->get();
        }

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
            'owners'         => $owners,
        ]);
    }

    /*========
     * GET /api/feedback/export
     * Admin only: export feedback as CSV.
     ========*/
    public function export(Request $request): StreamedResponse
    {
        /*====== check if user is admin ======*/
        if (! $request->user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }

        $query = Feedback::query();

        if ($request->has('owner_id')) {
            $query->where('user_id', $request->owner_id);
        }

        $feedback = $query->with('user:id,name,email')->latest()->get();

        $filename = 'feedback_export_' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($feedback) {
            $handle = fopen('php://output', 'w');

            // Header
            fputcsv($handle, [
                'ID',
                'Owner',
                'Owner Email',
                'Client First Name',
                'Client Last Name',
                'Client Email',
                'Client Phone',
                'Client WhatsApp',
                'Rating',
                'Comment',
                'Source',
                'Created At',
            ]);

            /*====== Data ======*/
            foreach ($feedback as $fb) {
                fputcsv($handle, [
                    $fb->id,
                    $fb->user->name ?? '',
                    $fb->user->email ?? '',
                    $fb->first_name,
                    $fb->last_name,
                    $fb->email ?? '',
                    $fb->phone ?? '',
                    $fb->whatsapp ?? '',
                    $fb->rating,
                    $fb->comment,
                    $fb->source,
                    $fb->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}