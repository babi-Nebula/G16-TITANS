import Link from "next/link";

interface PlatformNavProps {
  userName: string;
}

export default function PlatformNav({ userName }: PlatformNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-700">
            MindCare Connect
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/auth">Book Now</Link>
          </nav>
        </div>
        <div className="text-sm text-slate-600">
          Logged in as <span className="font-semibold text-slate-900">{userName}</span>
        </div>
      </div>
    </header>
  );
}
