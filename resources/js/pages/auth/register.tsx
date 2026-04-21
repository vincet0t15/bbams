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

type Course = {
    id: number;
    name: string;
    code: string;
};

type YearLevel = {
    id: number;
    name: string;
};

type Props = {
    courses: Course[];
    yearLevels: YearLevel[];
};

export default function Register() {
    const { props } = usePage<{ courses: Course[]; yearLevels: YearLevel[] }>();
    const courses = props.courses || [];
    const yearLevels = props.yearLevels || [];
    const [formData, setFormData] = useState({
        account_type: 'student',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        security_question: '',
        security_answer: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        extension_name: '',
        student_no: '',
        employee_no: '',
        course_id: '',
        year_level_id: '',
        section: '',
        department: '',
        position: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/register', formData);
            toast.success('Registration successful! Welcome to BBAMS.');
            window.location.href = '/dashboard';
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Registration failed. Please try again.',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form onSubmit={submit} className="flex max-w-md flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="account_type">Account Type</Label>
                        <Select
                            value={formData.account_type}
                            onValueChange={(value) =>
                                handleChange('account_type', value)
                            }
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
                        <InputError message={errors.account_type} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={(e) =>
                                    handleChange('last_name', e.target.value)
                                }
                                placeholder="Last name"
                            />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={(e) =>
                                    handleChange('first_name', e.target.value)
                                }
                                placeholder="First name"
                            />
                            <InputError message={errors.first_name} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                                id="middle_name"
                                type="text"
                                value={formData.middle_name}
                                onChange={(e) =>
                                    handleChange('middle_name', e.target.value)
                                }
                                placeholder="Middle name"
                            />
                            <InputError message={errors.middle_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="extension_name">
                                Extension Name
                            </Label>
                            <Input
                                id="extension_name"
                                type="text"
                                value={formData.extension_name}
                                onChange={(e) =>
                                    handleChange(
                                        'extension_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. Jr., Sr."
                            />
                            <InputError message={errors.extension_name} />
                        </div>
                    </div>

                    {formData.account_type === 'student' && (
                        <div className="grid gap-2">
                            <Label htmlFor="student_no">Student Number</Label>
                            <Input
                                id="student_no"
                                type="text"
                                value={formData.student_no}
                                onChange={(e) =>
                                    handleChange('student_no', e.target.value)
                                }
                                placeholder="Student Number"
                            />
                            <InputError message={errors.student_no} />
                        </div>
                    )}

                    {(formData.account_type === 'faculty' ||
                        formData.account_type === 'staff') && (
                        <div className="grid gap-2">
                            <Label htmlFor="employee_no">Employee Number</Label>
                            <Input
                                id="employee_no"
                                type="text"
                                value={formData.employee_no}
                                onChange={(e) =>
                                    handleChange('employee_no', e.target.value)
                                }
                                placeholder="Employee Number"
                            />
                            <InputError message={errors.employee_no} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            autoFocus
                            value={formData.username}
                            onChange={(e) =>
                                handleChange('username', e.target.value)
                            }
                            placeholder="Username"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                handleChange('password', e.target.value)
                            }
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            required
                            value={formData.password_confirmation}
                            onChange={(e) =>
                                handleChange(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="security_question">
                            Security Question
                        </Label>
                        <Select
                            value={formData.security_question}
                            onValueChange={(value) =>
                                handleChange('security_question', value)
                            }
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
                        <InputError message={errors.security_question} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="security_answer">Security Answer</Label>
                        <Input
                            id="security_answer"
                            type="text"
                            required
                            value={formData.security_answer}
                            onChange={(e) =>
                                handleChange('security_answer', e.target.value)
                            }
                            placeholder="Your answer"
                        />
                        <InputError message={errors.security_answer} />
                    </div>

                    {formData.account_type === 'student' && (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="course_id">Program</Label>
                                    <Select
                                        value={formData.course_id}
                                        onValueChange={(value) =>
                                            handleChange('course_id', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map((course) => (
                                                <SelectItem
                                                    key={course.id}
                                                    value={String(course.id)}
                                                >
                                                    {course.name} ({course.code}
                                                    )
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.course_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="year_level_id">
                                        Year Level
                                    </Label>
                                    <Select
                                        value={formData.year_level_id}
                                        onValueChange={(value) =>
                                            handleChange('year_level_id', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select year level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearLevels.map((level) => (
                                                <SelectItem
                                                    key={level.id}
                                                    value={String(level.id)}
                                                >
                                                    {level.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.year_level_id}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="section">Section</Label>
                                <Input
                                    id="section"
                                    type="text"
                                    value={formData.section}
                                    onChange={(e) =>
                                        handleChange('section', e.target.value)
                                    }
                                    placeholder="Section"
                                />
                                <InputError message={errors.section} />
                            </div>
                        </>
                    )}

                    {(formData.account_type === 'faculty' ||
                        formData.account_type === 'staff') && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) =>
                                        handleChange(
                                            'department',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Department"
                                />
                                <InputError message={errors.department} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) =>
                                        handleChange('position', e.target.value)
                                    }
                                    placeholder="Position"
                                />
                                <InputError message={errors.position} />
                            </div>
                        </div>
                    )}

                    {errors.general && (
                        <div className="text-sm text-red-500">
                            {errors.general}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : 'Create account'}
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
