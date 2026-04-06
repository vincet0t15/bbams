import { Head, useForm } from '@inertiajs/react';
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
import { login, register } from '@/routes';

const SECURITY_QUESTIONS = [
    'What is your favorite pet name?',
    'What is the name of your first school?',
    'What is your favorite color?',
    'What is the name of your hometown?',
    'What is your favorite food?',
    'What is the name of your best friend?',
    'What is your dream job?',
    'What is your favorite movie?',
];

export default function Register() {
    const form = useForm({
        account_type: 'student',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        security_question: '',
        security_answer: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(register(), {
            onSuccess: () => {
                form.reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="account_type">Account Type</Label>
                        <Select
                            value={form.data.account_type}
                            onValueChange={(value) =>
                                form.setData('account_type', value)
                            }
                            name="account_type"
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.account_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            autoFocus
                            value={form.data.username}
                            onChange={(e) =>
                                form.setData('username', e.target.value)
                            }
                            placeholder="Username"
                        />
                        <InputError message={form.errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            placeholder="email@example.com"
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            required
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                            placeholder="Password"
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            required
                            value={form.data.password_confirmation}
                            onChange={(e) =>
                                form.setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            placeholder="Confirm password"
                        />
                        <InputError
                            message={form.errors.password_confirmation}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="security_question">
                            Security Question
                        </Label>
                        <Select
                            value={form.data.security_question}
                            onValueChange={(value) =>
                                form.setData('security_question', value)
                            }
                            name="security_question"
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a security question" />
                            </SelectTrigger>
                            <SelectContent>
                                {SECURITY_QUESTIONS.map((q) => (
                                    <SelectItem key={q} value={q}>
                                        {q}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.security_question} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="security_answer">Security Answer</Label>
                        <Input
                            id="security_answer"
                            type="text"
                            required
                            value={form.data.security_answer}
                            onChange={(e) =>
                                form.setData('security_answer', e.target.value)
                            }
                            placeholder="Your answer"
                        />
                        <InputError message={form.errors.security_answer} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={form.processing}
                    >
                        {form.processing && <Spinner />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()}>Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
