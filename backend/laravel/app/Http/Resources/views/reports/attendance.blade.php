 
{{-- ============================================================ --}}
{{-- resources/views/reports/attendance.blade.php --}}
{{-- ============================================================ --}}
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size:10px; color:#1a1a1a; }
  .header { background:#4F46E5; color:white; padding:18px 24px; }
  .header h1 { font-size:16px; }
  .header p  { font-size:9px; opacity:.8; margin-top:3px; }
  table { width:100%; border-collapse:collapse; }
  th { padding:6px 8px; font-size:9px; background:#F8FAFC; border:1px solid #E5E7EB;
       text-align:center; color:#6B7280; }
  th.name { text-align:left; }
  td { padding:5px 8px; border:1px solid #F3F4F6; text-align:center; }
  td.name { text-align:left; font-weight:500; }
  .P { background:#D1FAE5; color:#065F46; border-radius:3px; font-size:9px; }
  .A { background:#FEE2E2; color:#991B1B; border-radius:3px; font-size:9px; }
  .R { background:#FEF3C7; color:#92400E; border-radius:3px; font-size:9px; }
  .E { background:#DBEAFE; color:#1E40AF; border-radius:3px; font-size:9px; }
  .rate-good { color:#059669; font-weight:bold; }
  .rate-warn { color:#D97706; font-weight:bold; }
  .rate-bad  { color:#DC2626; font-weight:bold; }
  .footer { padding:10px 24px; border-top:1px solid #E5E7EB; font-size:9px; color:#9CA3AF;
            display:flex; justify-content:space-between; margin-top:8px; }
</style>
</head>
<body>
 
<div class="header">
  <h1>Rapport de présences — {{ $group->name }}</h1>
  <p>{{ $group->course->title }} · {{ $group->teacher->full_name }} · {{ now()->format('d/m/Y') }}</p>
</div>
 
<div style="padding:8px 24px; background:#EEF2FF; font-size:9px; color:#4338CA;">
  P = Présent &nbsp;|&nbsp; A = Absent &nbsp;|&nbsp; R = Retard &nbsp;|&nbsp; E = Excusé
</div>
 
@php
  $sessions = $group->sessions->where('status', 'completed')->sortBy('session_date');
  $students = $group->students;
@endphp
 
<div style="padding:0 24px; overflow:auto;">
<table>
  <thead>
    <tr>
      <th class="name" style="width:140px;">Étudiant</th>
      @foreach($sessions as $session)
      <th style="width:30px; font-size:8px;">
        {{ \Carbon\Carbon::parse($session->session_date)->format('d/m') }}
      </th>
      @endforeach
      <th style="width:50px;">Taux</th>
    </tr>
  </thead>
  <tbody>
    @foreach($students as $student)
    @php
      $attended = $student->attendance->keyBy('session_id');
      $present  = 0; $total = $sessions->count();
    @endphp
    <tr>
      <td class="name">{{ $student->full_name }}</td>
      @foreach($sessions as $session)
      @php
        $record = $attended->get($session->id);
        $status = $record?->status ?? 'absent';
        if(in_array($status, ['present','late'])) $present++;
        $code = ['present'=>'P','absent'=>'A','late'=>'R','excused'=>'E'][$status];
      @endphp
      <td><span class="{{ $code }}">{{ $code }}</span></td>
      @endforeach
      @php $rate = $total > 0 ? round($present/$total*100) : 0; @endphp
      <td class="{{ $rate >= 80 ? 'rate-good' : ($rate >= 60 ? 'rate-warn' : 'rate-bad') }}">
        {{ $rate }}%
      </td>
    </tr>
    @endforeach
  </tbody>
</table>
</div>
 
<div class="footer">
  <span>ILIMA Formation & Consulting</span>
  <span>{{ $sessions->count() }} séances · {{ $students->count() }} étudiants</span>
  <span>Généré le {{ now()->format('d/m/Y H:i') }}</span>
</div>
 
</body>
</html>