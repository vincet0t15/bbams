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
import type { Faculty } from '@/types/faculty';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    faculty: Faculty;
}
const FacultyDeleteDialog = ({ open, setOpen, faculty }: Props) => {
    const [confirmText, setConfirmText] = useState('');
    const requiredText = `${faculty.user.name}`;
    const del = () => {
        router.delete(`/faculties/${faculty.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Faculty deleted successfully');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Faculty</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete this faculty profile.
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
                        onClick={del}
                    >
                        Delete Faculty
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default FacultyDeleteDialog;
