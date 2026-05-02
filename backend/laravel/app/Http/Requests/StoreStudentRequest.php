<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')?->id;

        return [
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'gender'          => 'nullable|in:M,F',
            'birth_date'      => 'nullable|date|before:today',
            'phone'           => 'required|string|max:20',
            'email'           => "nullable|email|unique:students,email,{$studentId}",
            'address'         => 'nullable|string',
            'education_level' => 'nullable|string|max:100',
            'specialization'  => 'nullable|string|max:100',
            'notes'           => 'nullable|string',
        ];
    }
}
