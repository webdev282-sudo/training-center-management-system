<?php

namespace App\Services;

use App\Models\Group;
use Carbon\Carbon;

class SessionGeneratorService
{
    private const DAY_MAP = [
        'lundi' => 1,
        'mardi' => 2,
        'mercredi' => 3,
        'jeudi' => 4,
        'vendredi' => 5,
        'samedi' => 6,
        'dimanche' => 0,
    ];

    public function generateForGroup(Group $group): int
    {
        $start = Carbon::parse($group->start_date);

        $end = $group->end_date
            ? Carbon::parse($group->end_date)
            : $start->copy()->addMonths(3);

        $days = array_map(
            fn ($d) => self::DAY_MAP[$d] ?? null,
            $group->days ?? []
        );

        $days = array_filter($days, fn ($d) => $d !== null);

        $order = 1;
        $created = 0;
        $current = $start->copy();

        $existing = $group->sessions()
            ->pluck('session_date')
            ->map(fn ($d) => Carbon::parse($d)->toDateString())
            ->flip();

        while ($current->lte($end)) {
            if (
                in_array($current->dayOfWeek, $days, true) &&
                !isset($existing[$current->toDateString()])
            ) {
                $group->sessions()->create([
                    'teacher_id' => $group->teacher_id,
                    'session_date' => $current->toDateString(),
                    'start_time' => $group->start_time,
                    'end_time' => $group->end_time,
                    'room' => $group->room,
                    'lesson_order' => $order,
                    'status' => 'scheduled',
                ]);

                $order++;
                $created++;
            }

            $current->addDay();
        }

        return $created;
    }
}