import { useForm } from '@inertiajs/react';
import { SubmitEventHandler, useRef } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Course, CourseCreateRequest } from '@/types/course';
import courses from '@/routes/courses';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    course: Course
}
export default function CourseEditDialog({ open, setOpen, course }: Props) {

    const { data, setData, put, reset, processing, errors } = useForm<CourseCreateRequest>({
        name: course.name,
        code: course.code,
        description: course.description,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put((courses.update(course.id).url), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit course</DialogTitle>
                    <DialogDescription>
                        Edit the details of the course below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Course Name</Label>
                            <Input id="name" placeholder="Bachelor of Science in Computer Science" value={data.name} onChange={handleChange} />
                            <span className="text-red-600 dark:text-red-400">{errors.name}</span>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Course Code</Label>
                            <Input id="code" placeholder="BSCS" value={data.code} onChange={handleChange} />
                            <span className="text-red-600 dark:text-red-400">{errors.code}</span>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Description" value={data.description} onChange={handleChange} />
                            <span className="text-red-600 dark:text-red-400">{errors.description}</span>
                        </div>
                        <Button className="w-full" type="submit" disabled={processing}>
                            {processing ? <span className='flex gap-2 items-center'><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Updating...</span> : 'Update Course'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
