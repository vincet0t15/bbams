export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-white">
                <img
                    src="/logos/PSU_logo.png"
                    alt="PSU Logo"
                    className="size-8 rounded-sm object-contain"
                />
            </div>
            <div className="ml-2 flex min-w-0 flex-1 flex-col justify-center text-left">
                <span className="text-[11px] leading-[1.1] font-semibold break-words whitespace-normal">
                    Biometric-Based Attendance Monitoring System
                </span>
                <span className="mt-0.5 text-[9px] leading-[1.1] break-words whitespace-normal opacity-80">
                    Palawan State University San Vicente Campus
                </span>
            </div>
        </>
    );
}
