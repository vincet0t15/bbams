export default function PrintFooter() {
    return (
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-[9px] text-gray-600">
            <p className="m-0">
                This is a system-generated document. No signature is required.
            </p>
            <p className="m-0">
                Generated on {new Date().toLocaleString('en-PH')}
            </p>
        </div>
    );
}
