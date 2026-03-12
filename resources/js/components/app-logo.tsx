export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-orange-600 p-1 text-white">
                <img
                    src="/logos/PSU_logo.png"
                    alt="PSU Logo"
                    className="size-8 rounded-sm object-contain"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold">
                    Biometric-Based Attendance
                </span>
                <span className="truncate text-[10px] leading-tight opacity-80">
                    Palawan State University San Vicente Campus
                </span>
            </div>
        </>
    );
}
