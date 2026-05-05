<?php

namespace App\Http\Requests;

use App\Models\Feedback;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['nullable', 'email', 'max:255'],
            'phone'      => ['nullable', 'string', 'max:20'],
            'whatsapp'   => ['nullable', 'string', 'max:20'],
            'rating'     => ['required', 'integer', 'min:' . Feedback::MIN_RATING, 'max:' . Feedback::MAX_RATING],
            'comment'    => ['required', 'string', 'max:2000'],
            'source'     => ['required', 'string', Rule::in(Feedback::SOURCES)],
        ];
    }

    /**
     * Au moins un moyen de contact obligatoire.
     */
    public function after(): array
    {
        return [
            function ($validator) {
                if (! $this->email && ! $this->phone && ! $this->whatsapp) {
                    $validator->errors()->add(
                        'contact',
                        'Please provide at least one contact method (email, phone, or WhatsApp).'
                    );
                }
            },
        ];
    }
}