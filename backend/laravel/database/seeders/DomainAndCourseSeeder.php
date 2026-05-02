<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Domain;
use App\Models\Course;

class DomainAndCourseSeeder extends Seeder
{
    public function run(): void
    {
        $langues = Domain::create(['name' => 'Langues', 'description' => 'Formations linguistiques']);
        $info    = Domain::create(['name' => 'Informatique', 'description' => 'Formations IT']);
        $gestion = Domain::create(['name' => 'Gestion & Business', 'description' => 'Management et commerce']);

        $courses = [
            ['domain_id' => $langues->id, 'title' => 'Anglais B2', 'duration' => '3 mois', 'sessions_count' => 36, 'price' => 18000, 'level' => 'intermédiaire'],
            ['domain_id' => $langues->id, 'title' => 'Français A1', 'duration' => '2 mois', 'sessions_count' => 24, 'price' => 12000, 'level' => 'débutant'],
            ['domain_id' => $langues->id, 'title' => 'Espagnol A2', 'duration' => '3 mois', 'sessions_count' => 30, 'price' => 15000, 'level' => 'débutant'],
            ['domain_id' => $info->id,    'title' => 'Informatique Bureautique', 'duration' => '4 mois', 'sessions_count' => 48, 'price' => 24000, 'level' => 'débutant'],
            ['domain_id' => $info->id,    'title' => 'Développement Web', 'duration' => '6 mois', 'sessions_count' => 72, 'price' => 42000, 'level' => 'intermédiaire'],
            ['domain_id' => $gestion->id, 'title' => 'Marketing Digital', 'duration' => '5 mois', 'sessions_count' => 60, 'price' => 32000, 'level' => 'intermédiaire'],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}