import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

type User = {
    id: number;
    email: string;
    security_question: string;
};

export default function ForgotPassword() {
    const [step, setStep] = useState<'email' | 'question' | 'reset' | 'done'>(
        'email',
    );
    const [email, setEmail] = useState('');
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        security_answer: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const searchUser = async (emailValue: string) => {
        setEmail(emailValue);
        if (emailValue.length < 3) {
            setUsers([]);
            return;
        }

        try {
            const response = await axios.get('/api/users/search', {
                params: { email: emailValue },
            });
            setUsers(response.data);
        } catch (error) {
            setUsers([]);
        }
    };

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (users.length === 0) {
            setErrors({ email: 'No account found with this email.' });
            return;
        }
        if (users.length === 1) {
            setSelectedUser(users[0]);
            setStep('question');
        } else {
            setErrors({ email: 'Please select your account below.' });
        }
    };

    const handleSendResetLink = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/api/forgot-password/email', { email });
            toast.success('If that email exists, a reset link was sent.');
        } catch (error: any) {
            setErrors({
                email:
                    error.response?.data?.email || 'Unable to send reset link.',
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setStep('question');
    };

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            const response = await axios.post('/api/forgot-password/verify', {
                user_id: selectedUser?.id,
                security_answer: formData.security_answer,
            });

            if (response.data.temp_password) {
                setTempPassword(response.data.temp_password);
                setStep('done');
            } else if (response.data.valid) {
                setStep('reset');
            } else {
                setErrors({
                    security_answer: 'Incorrect answer. Please try again.',
                });
            }
        } catch (error: any) {
            setErrors({
                security_answer:
                    error.response?.data?.message || 'Invalid answer.',
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/api/forgot-password/reset', {
                user_id: selectedUser?.id,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            toast.success('Password reset successfully! You can now log in.');
            window.location.href = login();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Failed to reset password. Please try again.',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password"
            description="Recover your account using your security question"
        >
            <Head title="Forgot Password" />

            {step === 'email' && (
                <form
                    onSubmit={handleSubmitEmail}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => searchUser(e.target.value)}
                            placeholder="Enter your email"
                            autoFocus
                        />
                        <InputError message={errors.email} />
                    </div>

                    {users.length > 1 && (
                        <div className="space-y-2">
                            <Label>Select your account</Label>
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="cursor-pointer rounded-md border p-3 hover:bg-muted"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <div className="font-medium">
                                            {user.email}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {users.length === 1 && (
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    )}

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleSendResetLink}
                            disabled={processing}
                        >
                            {processing
                                ? 'Sending…'
                                : 'Send reset link by email'}
                        </Button>
                        {users.length > 1 && (
                            <Button type="submit" className="w-40">
                                Continue
                            </Button>
                        )}
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <TextLink href={login()}>Log in</TextLink>
                    </div>
                </form>
            )}

            {step === 'question' && selectedUser && (
                <form
                    onSubmit={handleSubmitAnswer}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-2">
                        <Label>Security Question</Label>
                        <div className="rounded-md bg-muted p-3 text-sm">
                            {selectedUser.security_question}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="security_answer">Your Answer</Label>
                        <Input
                            id="security_answer"
                            type="text"
                            value={formData.security_answer}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    security_answer: e.target.value,
                                }))
                            }
                            placeholder="Enter your answer"
                            autoFocus
                        />
                        <InputError message={errors.security_answer} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Verify Answer
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('email');
                                setUsers([]);
                                setSelectedUser(null);
                                setErrors({});
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            Back
                        </button>
                    </div>
                </form>
            )}

            {step === 'reset' && (
                <form
                    onSubmit={handleResetPassword}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <PasswordInput
                            id="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                            placeholder="New password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    password_confirmation: e.target.value,
                                }))
                            }
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {errors.general && (
                        <div className="text-sm text-red-500">
                            {errors.general}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Reset Password
                    </Button>
                </form>
            )}
            {step === 'done' && tempPassword && (
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label>Temporary Password</Label>
                        <div className="rounded-md bg-muted p-3 text-sm break-all">
                            {tempPassword}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A temporary password was created for your account.
                            Use it to log in, then change your password from
                            your profile.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={() => {
                                navigator.clipboard?.writeText(tempPassword);
                                toast.success('Copied to clipboard');
                            }}
                        >
                            Copy Password
                        </Button>
                        <Button
                            type="button"
                            className="w-40"
                            onClick={() => (window.location.href = login())}
                        >
                            Go to Login
                        </Button>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
