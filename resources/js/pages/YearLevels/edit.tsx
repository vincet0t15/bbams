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
import { Textarea } from '@/components/ui/textarea';
import type { YearLevel, YearLevelCreateRequest } from '@/types/year-level';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    yearLevel: YearLevel;
    courses: { id: number; name: string; code: string }[];
}

export default function YearLevelEditDialog({
    open,
    setOpen,
    yearLevel,
    courses,
}: Props) {
    const { data, setData, put, reset, processing, errors } =
        useForm<YearLevelCreateRequest>({
            course_id: yearLevel.course.id,
            name: yearLevel.name,
            description: yearLevel.description,
        });

    const handleTextChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(`/year-levels/${yearLevel.id}`, {
            onSuccess: () => {
                toast.success('Year level updated successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit year level</DialogTitle>
                    <DialogDescription>
                        Update year level details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Course</Label>
                            <Select
                                value={String(data.course_id)}
                                onValueChange={(val) =>
                                    setData('course_id', Number(val))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label htmlFor="name">Year Level</Label>
                            <Input
                                id="name"
                                placeholder="e.g., First Year, Second Year"
                                value={data.name}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.name as any} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Optional"
                                value={data.description}
                                onChange={handleTextChange}
                            />
                            <InputError message={errors.description as any} />
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
                                'Update Year Level'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
