interface FlashProps extends Record<string, unknown> {
    flash?: {
        success?: string;
        error?: string;
    };
}
