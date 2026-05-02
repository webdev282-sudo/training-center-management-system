{{-- ============================================================ --}}
{{-- resources/views/reports/schedule.blade.php                  --}}
{{-- Orientation : paysage (A4)                                  --}}
{{-- ============================================================ --}}
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: DejaVu Sans, sans-serif;
    font-size: 10px;
    color: #1a1a1a;
    background: #fff;
  }

  .header {
    background: #4F46E5;
    color: white;
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1 { font-size: 16px; font-weight: bold; }
  .header p { font-size: 9px; opacity: .75; margin-top: 3px; }
  .header .date { text-align: right; font-size: 10px; opacity: .85; }

  .grid-wrap { padding: 16px 24px; }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th {
    background: #EEF2FF;
    color: #4338CA;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: .4px;
    font-weight: bold;
    padding: 7px 6px;
    text-align: center;
    border: 1px solid #C7D2FE;
  }

  th.time-col {
    background: #F8FAFC;
    color: #6B7280;
    width: 56px;
  }

  td {
    border: 1px solid #E5E7EB;
    vertical-align: top;
    padding: 4px;
    height: 52px;
  }

  td.time-cell {
    background: #F8FAFC;
    text-align: center;
    color: #9CA3AF;
    font-size: 9px;
    font-weight: bold;
    vertical-align: middle;
  }

  .session-card {
    border-radius: 4px;
    padding: 4px 6px;
    height: 100%;
    display: block;
    margin-bottom: 3px;
  }

  .session-card .course {
    font-size: 9px;
    font-weight: bold;
  }

  .session-card .details {
    font-size: 8px;
    opacity: .75;
    margin-top: 2px;
  }

  .session-card .teacher {
    font-size: 8px;
    margin-top: 1px;
    font-style: italic;
  }

  .color-0 { background: #EEF0FF; color: #3730A3; border-left: 3px solid #4F46E5; }
  .color-1 { background: #D1FAE5; color: #064E3B; border-left: 3px solid #10B981; }
  .color-2 { background: #FEF3C7; color: #78350F; border-left: 3px solid #F59E0B; }
  .color-3 { background: #FEE2E2; color: #7F1D1D; border-left: 3px solid #EF4444; }
  .color-4 { background: #E0E7FF; color: #1E1B4B; border-left: 3px solid #6366F1; }
  .color-5 { background: #FCE7F3; color: #831843; border-left: 3px solid #EC4899; }
  .color-6 { background: #ECFDF5; color: #064E3B; border-left: 3px solid #34D399; }
  .color-7 { background: #FFF7ED; color: #7C2D12; border-left: 3px solid #F97316; }

  .empty {
    color: #CBD5E1;
    font-size: 8px;
    text-align: center;
    padding-top: 14px;
  }

  .legend {
    padding: 10px 24px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    color: #374151;
    margin-right: 8px;
    margin-bottom: 5px;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .footer {
    margin: 0 24px;
    padding-top: 10px;
    border-top: 1px solid #E5E7EB;
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: #9CA3AF;
  }
</style>
</head>

<body>

@php
  $days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  $dayKeys = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  $timeSlots = [
    '08:00–10:00',
    '10:00–12:00',
    '12:00–14:00',
    '14:00–16:00',
    '16:00–18:00',
    '18:00–20:00',
  ];

  $colorPalette = [];
  $schedule = [];

  foreach ($groups as $i => $group) {
    $groupId = $group->id ?? $i;
    $colorPalette[$groupId] = 'color-' . ($i % 8);

    $groupDays = $group->days ?? [];

    if (is_string($groupDays)) {
      $decodedDays = json_decode($groupDays, true);
      $groupDays = is_array($decodedDays) ? $decodedDays : [];
    }

    foreach ($groupDays as $day) {
      $start = substr($group->start_time ?? $group->startTime ?? '08:00', 0, 5);
      $end = substr($group->end_time ?? $group->endTime ?? '10:00', 0, 5);

      $slot = $start . '–' . $end;

      if (!isset($schedule[$day])) {
        $schedule[$day] = [];
      }

      if (!isset($schedule[$day][$slot])) {
        $schedule[$day][$slot] = [];
      }

      $schedule[$day][$slot][] = $group;
    }
  }
@endphp

<div class="header">
  <div>
    <h1>Planning Hebdomadaire</h1>
    <p>ILIMA Formation & Consulting — Groupes actifs</p>
  </div>

  <div class="date">
    Généré le {{ now()->locale('fr')->isoFormat('dddd D MMMM YYYY') }}<br>
    {{ method_exists($groups, 'count') ? $groups->count() : count($groups) }} groupe(s) actif(s)
  </div>
</div>

<div class="grid-wrap">
  <table>
    <thead>
      <tr>
        <th class="time-col">Horaire</th>
        @foreach($days as $day)
          <th>{{ $day }}</th>
        @endforeach
      </tr>
    </thead>

    <tbody>
      @foreach($timeSlots as $slot)
        <tr>
          <td class="time-cell">{{ $slot }}</td>

          @foreach($dayKeys as $dayKey)
            <td>
              @if(isset($schedule[$dayKey][$slot]))
                @foreach($schedule[$dayKey][$slot] as $group)
                  @php
                    $groupId = $group->id ?? 0;
                    $colorClass = $colorPalette[$groupId] ?? 'color-0';

                    $courseTitle = $group->course->title ?? 'Sans cours';
                    $teacherName = $group->teacher->full_name
                      ?? $group->teacher->fullName
                      ?? 'Enseignant N/A';

                    $room = $group->room ?? 'Salle N/A';
                    $groupName = $group->name ?? 'Groupe N/A';
                  @endphp

                  <div class="session-card {{ $colorClass }}">
                    <div class="course">{{ $courseTitle }}</div>
                    <div class="details">{{ $groupName }} · {{ $room }}</div>
                    <div class="teacher">{{ $teacherName }}</div>
                  </div>
                @endforeach
              @else
                <div class="empty">Libre</div>
              @endif
            </td>
          @endforeach
        </tr>
      @endforeach
    </tbody>
  </table>
</div>

<div class="legend">
  @foreach($groups as $i => $group)
    @php
      $courseTitle = $group->course->title ?? 'Sans cours';
      $teacherName = $group->teacher->full_name
        ?? $group->teacher->fullName
        ?? 'Enseignant N/A';
      $groupName = $group->name ?? 'Groupe N/A';

      $bgColors = ['#C7D2FE','#A7F3D0','#FDE68A','#FECACA','#C7D2FE','#FBCFE8','#A7F3D0','#FED7AA'];
      $borderColors = ['#4F46E5','#10B981','#F59E0B','#EF4444','#6366F1','#EC4899','#34D399','#F97316'];
    @endphp

    <div class="legend-item">
      <div
        class="legend-dot"
        style="background: {{ $bgColors[$i % 8] }}; border-left: 3px solid {{ $borderColors[$i % 8] }};"
      ></div>
      {{ $courseTitle }} — {{ $groupName }} ({{ $teacherName }})
    </div>
  @endforeach
</div>

<div class="footer">
  <span>ILIMA Formation & Consulting</span>
  <span>Document généré automatiquement · Non contractuel</span>
  <span>{{ now()->format('d/m/Y H:i') }}</span>
</div>

</body>
</html>