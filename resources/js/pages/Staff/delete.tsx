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
import type { Staff } from '@/types/staff';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    staff: Staff;
}
const StaffDeleteDialog = ({ open, setOpen, staff }: Props) => {
    const [confirmText, setConfirmText] = useState('');
    const requiredText = `${staff.user.name}`;
    const del = () => {
        router.delete(`/staff/${staff.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Staff deleted successfully');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Staff</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete this staff profile.
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
                        Delete Staff
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default StaffDeleteDialog;
