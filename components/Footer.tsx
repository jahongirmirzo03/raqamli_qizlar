import Link from "next/link";
import { TEXTS } from "@/lib/texts";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-primary/15 bg-brand-card/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-serif text-xl font-bold tracking-wider text-brand-text"
            >
              <span className="w-8 h-8 rounded-xl bg-brand-accent/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
                <Sparkles className="w-4 h-4" />
              </span>
              {TEXTS.brand.name}
            </Link>
            <p className="mt-3 text-sm text-brand-muted leading-relaxed">
              {TEXTS.brand.tagline}. {TEXTS.brand.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary mb-3">
              Sahifalar
            </h3>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li>
                <Link href="/jobs" className="hover:text-brand-text transition-colors">
                  Barcha ishlar va mikro-vazifalar
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-text transition-colors">
                  Frilanser bo&apos;lib ro&apos;yxatdan o&apos;tish
                </Link>
              </li>
              <li>
                <Link href="/jobs/new" className="hover:text-brand-text transition-colors">
                  Buyurtma e&apos;lon qilish
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-text transition-colors">
                  Shaxsiy kabinet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary mb-3">
              Xavfsizlik va ishonch
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Platformada shaxsiy telefon raqamingiz va elektron pochtangiz ommaga ko&apos;rsatilmaydi.
              Har bir e&apos;lon va foydalanuvchi ustidan shikoyat yuborish hamda tasdiqlanganlik
              belgisini tekshirish imkoniyati mavjud.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>
            © {new Date().getFullYear()} {TEXTS.brand.name}. {TEXTS.footer.rights}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-brand-primary fill-brand-primary/30" />
            {TEXTS.footer.madeFor}
          </p>
        </div>
      </div>
    </footer>
  );
}
