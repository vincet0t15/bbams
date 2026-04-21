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
import type { FacultyCreateRequest } from '@/types/faculty';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function FacultyCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } =
        useForm<FacultyCreateRequest>({
            last_name: '',
            first_name: '',
            middle_name: '',
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
            security_question: '',
            security_answer: '',
            employee_no: '',
            department: '',
            position: '',
        });

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post('/faculties', {
            onSuccess: () => {
                toast.success('Faculty created successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create faculty</DialogTitle>
                    <DialogDescription>
                        Enter faculty details.
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
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
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
                                    value={data.password_confirmation}
                                    onChange={handleTextChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="employee_no">Employee No</Label>
                                <Input
                                    id="employee_no"
                                    placeholder="e.g., EMP-001"
                                    value={data.employee_no ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.employee_no as any}
                                />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    placeholder="e.g., IT"
                                    value={data.department ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.department as any}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                placeholder="e.g., Lecturer"
                                value={data.position ?? ''}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.position as any} />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="w-1/2 space-y-2">
                                <Label htmlFor="security_question">
                                    Security Question
                                </Label>
                                <Input
                                    id="security_question"
                                    placeholder="e.g., What is your pet's name?"
                                    value={data.security_question ?? ''}
                                    onChange={handleTextChange}
                                />
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
                                    type="text"
                                    placeholder="Answer"
                                    value={data.security_answer ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError
                                    message={errors.security_answer as any}
                                />
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
                                    Creating...
                                </span>
                            ) : (
                                'Create Faculty'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
