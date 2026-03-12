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
import type { Faculty, FacultyUpdateRequest } from '@/types/faculty';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    faculty: Faculty;
}

export default function FacultyEditDialog({ open, setOpen, faculty }: Props) {
    const { data, setData, put, reset, processing, errors } =
        useForm<FacultyUpdateRequest>({
            name: faculty.user.name,
            username: faculty.user.username,
            email: faculty.user.email,
            password: '',
            password_confirmation: '',
            employee_no: faculty.employee_no ?? '',
            department: faculty.department ?? '',
            position: faculty.position ?? '',
        });

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(`/faculties/${faculty.id}`, {
            onSuccess: () => {
                toast.success('Faculty updated successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl ">
                <DialogHeader>
                    <DialogTitle>Edit faculty</DialogTitle>
                    <DialogDescription>
                        Update faculty details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Full name"
                                value={data.name}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.name as any} />
                        </div>
                        <div className="flex justify-between items-center space-x-4">
                            <div className="space-y-2 w-1/2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Username"
                                    value={data.username}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.username as any} />
                            </div>
                            <div className="space-y-2 w-1/2">
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
                        <div className="flex justify-between items-center space-x-4">
                            <div className="space-y-2 w-1/2">
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
                            <div className="space-y-2 w-1/2">
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
                        <div className="flex justify-between items-center space-x-4">
                            <div className="space-y-2 w-1/2">
                                <Label htmlFor="employee_no">Employee No</Label>
                                <Input
                                    id="employee_no"
                                    placeholder="e.g., EMP-001"
                                    value={data.employee_no ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.employee_no as any} />
                            </div>
                            <div className="space-y-2 w-1/2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    placeholder="e.g., IT"
                                    value={data.department ?? ''}
                                    onChange={handleTextChange}
                                />
                                <InputError message={errors.department as any} />
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
                                'Update Faculty'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
