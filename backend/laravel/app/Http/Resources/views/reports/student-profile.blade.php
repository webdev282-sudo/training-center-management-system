<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
.header { background: #4F46E5; color: white; padding: 20px; }
.content { padding: 20px; }
.section { margin-bottom: 15px; }
.section-title { font-weight: bold; margin-bottom: 5px; }
</style>
</head>
<body>

<div class="header">
  <h1>Profil Étudiant</h1>
  <p>{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="content">

<div class="section">
  <div class="section-title">Informations</div>
  <p>Nom: {{ $student->full_name }}</p>
  <p>Téléphone: {{ $student->phone }}</p>
  <p>Email: {{ $student->email }}</p>
</div>

@if($student->payments->count())
<div class="section">
  <div class="section-title">Paiements</div>
  @foreach($student->payments as $payment)
    <p>Total: {{ $payment->total_amount }} DA</p>
    <p>Payé: {{ $payment->paid_amount }} DA</p>
    <p>Reste: {{ $payment->remaining_amount }} DA</p>
  @endforeach
</div>
@endif

</div>

</body>
</html>