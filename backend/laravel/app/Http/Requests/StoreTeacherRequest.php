<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $teacherId = $this->route('teacher')?->id;

        return [
            'full_name' => 'required|string|max:150',
            'phone'     => 'required|string|max:20',
            'email'     => "nullable|email|unique:teachers,email,{$teacherId}",
            'specialty' => 'nullable|string|max:100',
            'notes'     => 'nullable|string',
        ];
    }
}