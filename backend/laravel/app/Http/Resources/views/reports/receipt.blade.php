<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
.header { margin-bottom: 20px; }
</style>
</head>
<body>

<div class="header">
  <h2>Reçu de paiement</h2>
</div>

<p>Étudiant: {{ $payment->student->full_name }}</p>
<p>Montant total: {{ $payment->total_amount }} DA</p>
<p>Montant payé: {{ $payment->paid_amount }} DA</p>
<p>Reste: {{ $payment->remaining_amount }} DA</p>

</body>
</html>