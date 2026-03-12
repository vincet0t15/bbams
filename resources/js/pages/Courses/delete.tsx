import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import courses from '@/routes/courses';
import type { Course } from '@/types/course';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    course: Course;
}
const CourseDeleteDialog = ({ open, setOpen, course }: Props) => {
    const [confirmText, setConfirmText] = useState('');
    const requiredText = `${course.name}`;
    const deleteCourse = () => {
        router.delete(courses.destroy.url(course.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Course deleted successfully');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Course</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your course and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="confirm">
                        Type{' '}
                        <span className="font-mono font-semibold text-red-500">
                            {requiredText}
                        </span>{' '}
                        to confirm
                    </Label>
                    <Input
                        id="confirm"
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={requiredText}
                        value={confirmText}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={confirmText !== requiredText}
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            deleteCourse();
                        }}
                    >
                        Delete Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default CourseDeleteDialog;
