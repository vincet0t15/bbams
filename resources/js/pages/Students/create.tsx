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
import type { StudentCreateRequest } from '@/types/student';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    users: { id: number; name: string; email: string; username: string }[];
    courses: { id: number; name: string; code: string }[];
    yearLevels: { id: number; name: string }[];
}
export default function StudentCreateDialog({
    open,
    setOpen,
    users,
    courses,
    yearLevels,
}: Props) {
    const { data, setData, post, reset, processing, errors } =
        useForm<StudentCreateRequest>({
            user_id: (users[0]?.id as number) ?? 0,
            student_no: '',
            course_id: null,
            year_level_id: null,
            section: '',
        });

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post('/students', {
            onSuccess: () => {
                toast.success('Student created successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create student</DialogTitle>
                    <DialogDescription>
                        Enter student details.
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
                                    {users.map((u) => (
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
                            <Label htmlFor="student_no">Student No</Label>
                            <Input
                                id="student_no"
                                placeholder="e.g., 2026-00001"
                                value={data.student_no ?? ''}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.student_no as any} />
                        </div>
                        <div className="space-y-2">
                            <Label>Course</Label>
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
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
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
                        <div className="space-y-2">
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
                                    <SelectItem value="none">None</SelectItem>
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
                            <InputError message={errors.year_level_id as any} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section">Section</Label>
                            <Input
                                id="section"
                                placeholder="e.g., A"
                                value={data.section ?? ''}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.section as any} />
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
                                'Create Student'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
