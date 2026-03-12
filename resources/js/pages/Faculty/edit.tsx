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
import type { Faculty, FacultyCreateRequest } from '@/types/faculty';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    faculty: Faculty;
    users: { id: number; name: string; email: string; username: string }[];
}

export default function FacultyEditDialog({
    open,
    setOpen,
    faculty,
    users,
}: Props) {
    const mergedUsers = (() => {
        const list = [...users];

        if (!list.find((u) => u.id === faculty.user.id)) {
            list.unshift(faculty.user);
        }

        return list;
    })();

    const { data, setData, put, reset, processing, errors } =
        useForm<FacultyCreateRequest>({
            user_id: faculty.user.id,
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit faculty</DialogTitle>
                    <DialogDescription>
                        Update faculty details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select
                                value={String(data.user_id)}
                                onValueChange={(val) =>
                                    setData('user_id', Number(val))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mergedUsers.map((u) => (
                                        <SelectItem
                                            key={u.id}
                                            value={String(u.id)}
                                        >
                                            {u.name} ({u.username}) - {u.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.user_id as any} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employee_no">Employee No</Label>
                            <Input
                                id="employee_no"
                                placeholder="e.g., EMP-001"
                                value={data.employee_no ?? ''}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.employee_no as any} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                placeholder="e.g., IT"
                                value={data.department ?? ''}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.department as any} />
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
