{{-- resources/views/reports/group-roster.blade.php --}}
{{-- ============================================================ --}}
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size:12px; color:#1a1a1a; }
  .header { background:#4F46E5; color:white; padding:20px 32px; }
  .header h1 { font-size:18px; }
  .header p  { font-size:10px; opacity:.8; margin-top:3px; }
  .meta { display:flex; gap:24px; padding:14px 32px; background:#EEF2FF; border-bottom:1px solid #C7D2FE; }
  .meta-item label { font-size:9px; text-transform:uppercase; color:#6366F1; display:block; }
  .meta-item span  { font-size:12px; font-weight:bold; }
  table { width:100%; border-collapse:collapse; }
  thead tr { background:#F8FAFC; }
  th { text-align:left; padding:8px 16px; font-size:10px; color:#6B7280; font-weight:normal; text-transform:uppercase; letter-spacing:.3px; border-bottom:2px solid #E5E7EB; }
  td { padding:9px 16px; font-size:11px; border-bottom:1px solid #F3F4F6; }
  tr:nth-child(even) td { background:#FAFAFA; }
  .footer { padding:12px 32px; border-top:1px solid #E5E7EB; font-size:9px; color:#9CA3AF; display:flex; justify-content:space-between; }
</style>
</head>
<body>
 
<div class="header">
  <h1>Liste des étudiants — {{ $group->name }}</h1>
  <p>ILIMA Formation & Consulting · Généré le {{ now()->format('d/m/Y à H:i') }}</p>
</div>
 
<div class="meta">
  <div class="meta-item"><label>Cours</label><span>{{ $group->course->title }}</span></div>
  <div class="meta-item"><label>Enseignant</label><span>{{ $group->teacher->full_name }}</span></div>
  <div class="meta-item"><label>Salle</label><span>{{ $group->room ?? '—' }}</span></div>
  <div class="meta-item"><label>Horaire</label><span>{{ $group->start_time }} – {{ $group->end_time }}</span></div>
  <div class="meta-item"><label>Effectif</label><span>{{ $group->students->count() }} / {{ $group->capacity }}</span></div>
</div>
 
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Code</th>
      <th>Nom complet</th>
      <th>Téléphone</th>
      <th>Email</th>
      <th>Inscription</th>
      <th>Signature</th>
    </tr>
  </thead>
  <tbody>
    @foreach($group->students as $student)
    <tr>
      <td style="color:#9CA3AF;">{{ $loop->iteration }}</td>
      <td style="font-family:monospace; font-size:10px; color:#6B7280;">{{ $student->student_code }}</td>
      <td style="font-weight:500;">{{ $student->full_name }}</td>
      <td>{{ $student->phone }}</td>
      <td style="font-size:10px; color:#6B7280;">{{ $student->email ?? '—' }}</td>
      <td>{{ $student->pivot->enrollment_date }}</td>
      <td style="border-bottom:1px solid #9CA3AF; width:80px;">&nbsp;</td>
    </tr>
    @endforeach
  </tbody>
</table>
 
<div class="footer">
  <span>ILIMA Formation & Consulting</span>
  <span>{{ $group->name }} · {{ $group->students->count() }} étudiant(s)</span>
  <span>Page 1/1</span>
</div>
 
</body>
</html>