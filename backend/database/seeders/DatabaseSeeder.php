<?php

namespace Database\Seeders;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un user demo avec credentials connus
        $demo = User::create([
            'name'     => 'Demo User',
            'email'    => 'demo@example.com',
            'password' => Hash::make('password'),
        ]);

        // 30 feedbacks pour le demo user
        Feedback::factory()
            ->count(30)
            ->for($demo)
            ->create();
    }
}