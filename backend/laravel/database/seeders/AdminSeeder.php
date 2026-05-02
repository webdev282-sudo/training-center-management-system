<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name'     => 'Super Admin',
            'email'    => 'etm.ilima@gmail.com',
            'password' => Hash::make('password'),
            'role'     => 'super_admin',
        ]);
    }
}