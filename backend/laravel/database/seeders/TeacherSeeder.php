<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = [
            ['full_name' => 'Amira Boudiaf', 'phone' => '0770100001', 'email' => 'a.boudiaf@ilima.dz', 'specialty' => 'Anglais'],
            ['full_name' => 'Karim Mekki',   'phone' => '0770100002', 'email' => 'k.mekki@ilima.dz',   'specialty' => 'Français'],
            ['full_name' => 'Nadia Cherif',  'phone' => '0770100003', 'email' => 'n.cherif@ilima.dz',  'specialty' => 'Informatique'],
            ['full_name' => 'Yacine Ouadah', 'phone' => '0770100004', 'email' => 'y.ouadah@ilima.dz',  'specialty' => 'Marketing'],
        ];

        foreach ($teachers as $t) {
            Teacher::create($t);
        }
    }
}