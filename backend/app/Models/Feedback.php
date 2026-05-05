<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'whatsapp',
        'rating',
        'comment',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    // ── Relations ──────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ─────────────────────────────────────

    /**
     * Filtrer par user (sécurité: chacun voit que ses données).
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Feedback positif (4 ou 5 étoiles).
     */
    public function scopePositive($query)
    {
        return $query->where('rating', '>=', 4);
    }

    /**
     * Feedback négatif (1 ou 2 étoiles).
     */
    public function scopeNegative($query)
    {
        return $query->where('rating', '<=', 2);
    }

    // ── Accessors ──────────────────────────────────

    /**
     * Nom complet du client: "John Doe"
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // ── Constants ──────────────────────────────────

    public const SOURCES = ['whatsapp', 'email', 'website', 'phone', 'other'];
    public const MIN_RATING = 1;
    public const MAX_RATING = 5;
}