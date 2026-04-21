<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as ValidationPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function search(Request $request)
    {
        $email = $request->input('email');

        $users = User::where('email', 'like', "%{$email}%")
            ->get(['id', 'email', 'security_question']);

        return response()->json($users);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'security_answer' => ['required', 'string'],
        ]);

        $user = User::findOrFail($request->user_id);

        if (empty($user->security_question) || empty($user->security_answer)) {
            return response()->json([
                'valid' => false,
                'message' => 'Account has no security question set.',
            ], 422);
        }

        $answerMatches = strtolower(trim($user->security_answer)) === strtolower(trim($request->security_answer));

        if (!$answerMatches) {
            return response()->json([
                'valid' => false,
                'message' => 'Incorrect answer.',
            ], 422);
        }

        // Generate a temporary password, set it for the user, and return it
        $tempPassword = Str::random(10);
        $user->password = Hash::make($tempPassword);
        $user->save();

        return response()->json([
            'valid' => true,
            'temp_password' => $tempPassword,
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'password' => ['required', 'confirmed', ValidationPassword::defaults()],
        ]);

        $user = User::findOrFail($request->user_id);
        $user->password = $request->password;
        $user->save();

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Reset link sent to your email.']);
        }

        return response()->json(['email' => 'Unable to send reset link.'], 422);
    }
}
