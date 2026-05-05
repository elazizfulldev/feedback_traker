<?php

namespace App\Http\Requests;

use App\Models\Feedback;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name'  => ['sometimes', 'string', 'max:255'],
            'email'      => ['nullable', 'email', 'max:255'],
            'phone'      => ['nullable', 'string', 'max:20'],
            'whatsapp'   => ['nullable', 'string', 'max:20'],
            'rating'     => ['sometimes', 'integer', 'min:' . Feedback::MIN_RATING, 'max:' . Feedback::MAX_RATING],
            'comment'    => ['sometimes', 'string', 'max:2000'],
            'source'     => ['sometimes', 'string', Rule::in(Feedback::SOURCES)],
        ];
    }
}