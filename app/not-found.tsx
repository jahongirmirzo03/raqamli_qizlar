import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
      <div className="p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary mx-auto">
          <SearchX className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
          Sahifa topilmadi (404)
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          Siz qidirayotgan sahifa yoki e&apos;lon mavjud emas yoki o&apos;chirilgan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    </div>
  );
}
