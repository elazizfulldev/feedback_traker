<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Liste tous les users (admin only).
     */
    public function index(): JsonResponse
    {
        $users = User::latest()
            ->select('id', 'name', 'email', 'role', 'avatar', 'created_at')
            ->paginate(15);

        // Ajouter l'URL complète de l'avatar
        $users->getCollection()->transform(function ($user) {
            $user->avatar_url = $user->avatar
                ? asset('storage/avatars/' . $user->avatar)
                : null;
            return $user;
        });

        return response()->json($users);
    }

    /**
     * POST /api/users
     * Créer un nouveau user (admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', 'string', Rule::in(['admin', 'owner'])],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user'    => $user->only('id', 'name', 'email', 'role'),
        ], 201);
    }

    /**
     * PUT /api/users/{user}
     * Modifier un user (admin only).
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'role'     => ['sometimes', 'string', Rule::in(['admin', 'owner'])],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user'    => $user->fresh()->only('id', 'name', 'email', 'role'),
        ]);
    }

    /**
     * DELETE /api/users/{user}
     * Supprimer un user (admin only).
     * Admin ne peut pas se supprimer lui-même.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}