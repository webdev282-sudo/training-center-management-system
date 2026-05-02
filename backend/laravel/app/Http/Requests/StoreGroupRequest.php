<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id'   => 'required|exists:courses,id',
            'teacher_id'  => 'required|exists:teachers,id',
            'name'        => 'required|string|max:100',
            'room'        => 'nullable|string|max:50',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after:start_date',
            'days'        => 'required|array|min:1',
            'days.*'      => 'in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
            'capacity'    => 'required|integer|min:1|max:100',
        ];
    }
}