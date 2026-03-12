import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { SubmitEventHandler, ChangeEvent } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import courses from '@/routes/courses';
import type { CourseCreateRequest } from '@/types/course';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function CourseCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } =
        useForm<CourseCreateRequest>({
            name: '',
            code: '',
            description: '',
        });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(courses.store.url(), {
            onSuccess: () => {
                toast.success('Course created successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create course</DialogTitle>
                    <DialogDescription>
                        Enter your details below to create your account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Course Name</Label>
                            <Input
                                id="name"
                                placeholder="Bachelor of Science in Computer Science"
                                value={data.name}
                                onChange={handleChange}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Course Code</Label>
                            <Input
                                id="code"
                                placeholder="BSCS"
                                value={data.code}
                                onChange={handleChange}
                            />
                            <InputError message={errors.code} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Description"
                                value={data.description}
                                onChange={handleChange}
                            />
                            <InputError message={errors.description} />
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
                                'Create Course'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
