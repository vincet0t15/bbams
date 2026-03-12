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
import { Textarea } from '@/components/ui/textarea';
import type { YearLevelCreateRequest } from '@/types/year-level';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function YearLevelCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } =
        useForm<YearLevelCreateRequest>({
            name: '',
            description: '',
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
        post('/year-levels', {
            onSuccess: () => {
                toast.success('Year level created successfully');
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create year level</DialogTitle>
                    <DialogDescription>
                        Enter details to create a new year level.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
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
                                    Creating...
                                </span>
                            ) : (
                                'Create Year Level'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
