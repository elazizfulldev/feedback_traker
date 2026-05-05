<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();

            // Qui a créé ce feedback (le user connecté)
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Info du client
            $table->string('first_name');
            $table->string('last_name');

            // Contact du client (au moins un obligatoire)
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();

            // Le feedback
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment');
            $table->enum('source', ['whatsapp', 'email', 'website', 'phone', 'other'])
                  ->default('website');

            $table->timestamps();

            // Index pour recherche rapide par user
            $table->index(['user_id', 'created_at']);
            // Index pour filtrer par rating
            $table->index(['user_id', 'rating']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};