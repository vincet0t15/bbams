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
import type { Staff, StaffUpdateRequest } from '@/types/staff';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    staff: Staff;
}

export default function StaffEditDialog({ open, setOpen, staff }: Props) {
    const { data, setData, put, reset, processing, errors } =
        useForm<StaffUpdateRequest>({
            name: staff.user.name,
            last_name: staff.user.last_name ?? '',
            first_name: staff.user.first_name ?? '',
            middle_name: staff.user.middle_name ?? '',
            extension_name: staff.user.extension_name ?? '',
            security_question: staff.user.security_question ?? '',
            security_answer: staff.user.security_answer ?? '',
            username: staff.user.username,
            email: staff.user.email,
            password: '',
            password_confirmation: '',
            employee_no: staff.employee_no ?? '',
            department: staff.department ?? '',
            position: staff.position ?? '',
        });

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(`/staff/${staff.id}`, {
            onSuccess: () => {
                toast.success('Staff updated successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit staff</DialogTitle>
                    <DialogDescription>Update staff details.</DialogDescription>
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
                                <Label htmlFor="employee_no">Employee No</Label>
                                <Input
                                    id="employee_no"
                                    placeholder="e.g., EMP-101"
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
                                    placeholder="e.g., Admin"
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
                                placeholder="e.g., Clerk"
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
                                <Select
                                    value={
                                        data.security_question &&
                                        data.security_question !== ''
                                            ? data.security_question
                                            : 'none'
                                    }
                                    onValueChange={(val) =>
                                        setData(
                                            'security_question',
                                            val === 'none' ? '' : val,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {data.security_question ||
                                                'Select a security question'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Select a question
                                        </SelectItem>
                                        {data.security_question &&
                                        data.security_question !== 'none' ? (
                                            <SelectItem
                                                value={data.security_question}
                                            >
                                                {data.security_question}
                                            </SelectItem>
                                        ) : null}
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
                                    Updating...
                                </span>
                            ) : (
                                'Update Staff'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
