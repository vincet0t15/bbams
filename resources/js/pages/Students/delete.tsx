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
import type { Student } from '@/types/student';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    student: Student;
}
const StudentDeleteDialog = ({ open, setOpen, student }: Props) => {
    const [confirmText, setConfirmText] = useState('');
    const requiredText = `${student.user.name}`;
    const deleteStudent = () => {
        router.delete(`/students/${student.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Student deleted successfully');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Student</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete this student profile.
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
                        onClick={deleteStudent}
                    >
                        Delete Student
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default StudentDeleteDialog;
