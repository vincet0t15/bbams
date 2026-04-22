import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Student, StudentUpdateRequest } from '@/types/student';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    student: Student;
    courses: { id: number; name: string; code: string }[];
    yearLevels: { id: number; name: string }[];
}

export default function StudentEditDialog({
    open,
    setOpen,
    student,
    courses,
    yearLevels,
}: Props) {
    const { data, setData, put, reset, processing, errors } =
        useForm<StudentUpdateRequest>({
            name: student.user.name,
            last_name: student.user.last_name ?? '',
            first_name: student.user.first_name ?? '',
            middle_name: student.user.middle_name ?? '',
            extension_name: student.user.extension_name ?? '',
            security_question: student.user.security_question ?? '',
            security_answer: student.user.security_answer ?? '',
            username: student.user.username,
            email: student.user.email,
            password: '',
            password_confirmation: '',
            student_no: student.student_no ?? '',
            course_id: student.course?.id ?? null,
            year_level_id: student.year_level?.id ?? null,
            section: student.section ?? '',
        });

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(`/students/${student.id}`, {
            onSuccess: () => {
                toast.success('Student updated successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit student</DialogTitle>
                    <DialogDescription>
                        Update student details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/3 space-y-2">
                                <Label htmlFor="last_name">Last name</Label>
                                <Input
                                    id="last_name"
                                    placeholder="Last name"
                                    value={data.last_name ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.last_name as any} />
                            </div>
                            <div className="w-1/3 space-y-2">
                                <Label htmlFor="first_name">First name</Label>
                                <Input
                                    id="first_name"
                                    placeholder="First name"
                                    value={data.first_name ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.first_name as any}
                                />
                            </div>
                            <div className="w-1/3 space-y-2">
                                <Label htmlFor="middle_name">Middle name</Label>
                                <Input
                                    id="middle_name"
                                    placeholder="Middle name"
                                    value={data.middle_name ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.middle_name as any}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Username"
                                    value={data.username}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.username as any} />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.email as any} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    value={data.password ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.password as any} />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm password"
                                    value={data.password_confirmation ?? ''}
                                    onChange={handleTextChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="security_question">
                                    Security Question
                                </Label>
                                <Select
                                    value={data.security_question ?? 'none'}
                                    onValueChange={(val) =>
                                        setData(
                                            'security_question',
                                            val === 'none' ? '' : val,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a security question" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Select a question
                                        </SelectItem>
                                        <SelectItem
                                            value={
                                                "What was your first pet's name?"
                                            }
                                        >
                                            What was your first pet's name?
                                        </SelectItem>
                                        <SelectItem
                                            value={
                                                "What is your mother's maiden name?"
                                            }
                                        >
                                            What is your mother's maiden name?
                                        </SelectItem>
                                        <SelectItem
                                            value={
                                                'What was the name of your first school?'
                                            }
                                        >
                                            What was the name of your first
                                            school?
                                        </SelectItem>
                                        <SelectItem
                                            value={
                                                'What is your favorite color?'
                                            }
                                        >
                                            What is your favorite color?
                                        </SelectItem>
                                        <SelectItem
                                            value={
                                                'In what city were you born?'
                                            }
                                        >
                                            In what city were you born?
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.security_question as any}
                                />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="security_answer">
                                    Security Answer
                                </Label>
                                <Input
                                    id="security_answer"
                                    placeholder="Security answer"
                                    value={data.security_answer ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.security_answer as any}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="student_no">Student No</Label>
                                <Input
                                    id="student_no"
                                    placeholder="e.g., 2026-00001"
                                    value={data.student_no ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.student_no as any}
                                />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label>Program</Label>
                                <Select
                                    value={
                                        data.course_id
                                            ? String(data.course_id)
                                            : 'none'
                                    }
                                    onValueChange={(val) =>
                                        setData(
                                            'course_id',
                                            val === 'none' ? null : Number(val),
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {courses.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name} ({c.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.course_id as any} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label>Year Level</Label>
                                <Select
                                    value={
                                        data.year_level_id
                                            ? String(data.year_level_id)
                                            : 'none'
                                    }
                                    onValueChange={(val) =>
                                        setData(
                                            'year_level_id',
                                            val === 'none' ? null : Number(val),
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select year level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {yearLevels.map((yl) => (
                                            <SelectItem
                                                key={yl.id}
                                                value={String(yl.id)}
                                            >
                                                {yl.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.year_level_id as any}
                                />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="section">Section</Label>
                                <Input
                                    id="section"
                                    placeholder="e.g., A"
                                    value={data.section ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.section as any} />
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </span>
                            ) : (
                                'Update Student'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
