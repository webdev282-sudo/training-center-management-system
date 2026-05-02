<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'domain_id'      => 'required|exists:domains,id',
            'title'          => 'required|string|max:150',
            'description'    => 'nullable|string',
            'duration'       => 'required|string|max:50',
            'sessions_count' => 'nullable|integer|min:1',
            'price'          => 'required|numeric|min:0',
            'level'          => 'nullable|in:débutant,intermédiaire,avancé',
        ];
    }
}