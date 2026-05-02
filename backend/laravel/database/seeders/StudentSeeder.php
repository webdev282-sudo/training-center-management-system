<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    private array $names = [
        ['Kenza', 'Aït Yahia'], ['Mohamed', 'Hadjab'],
        ['Sara', 'Benali'], ['Youssef', 'Larbi'],
        ['Rania', 'Djoudi'], ['Amel', 'Mansouri'],
        ['Ilyes', 'Bensalem'], ['Dounia', 'Rahmani'],
        ['Sofiane', 'Meziane'], ['Yasmine', 'Khelil'],
        ['Omar', 'Tlemçani'], ['Lyna', 'Ferhat'],
    ];

    public function run(): void
    {
        foreach ($this->names as $i => [$first, $last]) {
            $year = now()->year;
            $num  = $i + 1;

            Student::create([
                'student_code'     => sprintf('STU-%d-%04d', $year, $num),
                'first_name'       => $first,
                'last_name'        => $last,
                'gender'           => in_array($first, ['Kenza','Sara','Rania','Amel','Dounia','Yasmine','Lyna']) ? 'F' : 'M',
                'phone'            => sprintf('077%07d', $num),
                'registration_date'=> now()->subDays(rand(10, 90))->toDateString(),
                'status'           => 'active',
            ]);
        }
    }
}