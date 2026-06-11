<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport étudiants et paiements</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #111827;
        }

        h1 {
            font-size: 20px;
            margin-bottom: 4px;
        }

        .subtitle {
            color: #6b7280;
            margin-bottom: 18px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f3f4f6;
            color: #374151;
            font-weight: bold;
            padding: 8px;
            border: 1px solid #d1d5db;
            text-align: left;
        }

        td {
            padding: 7px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
        }

        .money {
            text-align: right;
            white-space: nowrap;
        }

        .paid {
            color: #059669;
            font-weight: bold;
        }

        .rest {
            color: #dc2626;
            font-weight: bold;
        }

        .small {
            font-size: 10px;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <h1>Rapport des étudiants et paiements</h1>
    <div class="subtitle">
        Généré le {{ now()->format('d/m/Y H:i') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Étudiant</th>
                <th>Téléphone</th>
                <th>Formations / Groupes</th>
                <th>Total</th>
                <th>Payé</th>
                <th>Reste</th>
                <th>Statut paiement</th>
            </tr>
        </thead>

        <tbody>
            @foreach($students as $student)
                @php
                    $total = $student->payments->sum('total_amount');
                    $paid = $student->payments->sum('paid_amount');
                    $rest = $student->payments->sum('remaining_amount');

                    $paymentStatus = $rest <= 0 && $total > 0
                        ? 'Soldé'
                        : ($paid > 0 ? 'Partiel' : 'En attente');
                @endphp

                <tr>
                    <td>{{ $student->student_code ?? $student->studentCode ?? '-' }}</td>

                    <td>
                        <strong>
                            {{ $student->full_name ?? $student->fullName ?? (($student->first_name ?? '') . ' ' . ($student->last_name ?? '')) }}
                        </strong>
                    </td>

                    <td>{{ $student->phone ?? '-' }}</td>

                    <td>
                        @forelse($student->enrollments as $enrollment)
                            <div>
                                {{ $enrollment->group->course->title ?? '-' }}
                                <span class="small">
                                    / {{ $enrollment->group->name ?? '-' }}
                                </span>
                            </div>
                        @empty
                            -
                        @endforelse
                    </td>

                    <td class="money">
                        {{ number_format($total, 0, ',', ' ') }} DA
                    </td>

                    <td class="money paid">
                        {{ number_format($paid, 0, ',', ' ') }} DA
                    </td>

                    <td class="money rest">
                        {{ number_format($rest, 0, ',', ' ') }} DA
                    </td>

                    <td>{{ $paymentStatus }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>