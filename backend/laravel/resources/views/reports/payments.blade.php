<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Paiements</title>

    <style>
        body{
            font-family: DejaVu Sans;
            font-size:12px;
        }

        table{
            width:100%;
            border-collapse:collapse;
            margin-top:15px;
        }

        th,td{
            border:1px solid #ddd;
            padding:8px;
            text-align:left;
        }

        th{
            background:#f3f4f6;
        }
    </style>
</head>
<body>

    <h2>Liste des paiements</h2>

    <table>
        <thead>
            <tr>
                <th>Étudiant</th>
                <th>Total</th>
                <th>Payé</th>
                <th>Reste</th>
            </tr>
        </thead>

        <tbody>
            @foreach($payments as $payment)
                <tr>
                    <td>{{ $payment->student->full_name ?? '-' }}</td>
                    <td>{{ $payment->total_amount }}</td>
                    <td>{{ $payment->paid_amount }}</td>
                    <td>{{ $payment->remaining_amount }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>