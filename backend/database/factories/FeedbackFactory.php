<?php

namespace Database\Factories;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition(): array
    {
        return [
            'user_id'    => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name'  => fake()->lastName(),
            'email'      => fake()->optional(0.7)->safeEmail(),
            'phone'      => fake()->optional(0.5)->phoneNumber(),
            'whatsapp'   => fake()->optional(0.4)->phoneNumber(),
            'rating'     => fake()->numberBetween(1, 5),
            'comment'    => fake()->randomElement([
                'Great service, very responsive!',
                'Could be better, response time was slow.',
                'Absolutely loved working with this team.',
                'Average experience, nothing special.',
                'Outstanding support, exceeded expectations!',
                'The product quality needs improvement.',
                'Very professional and well-organized.',
                'Communication could be improved.',
                'Best experience I have ever had.',
                'Decent service but room for improvement.',
                'Quick turnaround, will definitely come back.',
                'Not satisfied with the final result.',
                'Smooth process from start to finish.',
                'The team was very knowledgeable.',
                'Pricing was fair for the quality delivered.',
            ]),
            'source' => fake()->randomElement(Feedback::SOURCES),
        ];
    }
}