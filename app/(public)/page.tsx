import Link from "next/link";
import { TEXTS } from "@/lib/texts";
import {
  Sparkles,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  HeartHandshake,
  Briefcase,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const { landing, brand } = TEXTS;

  return (
    <div className="space-y-16 sm:space-y-24 pb-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] sm:w-[720px] h-[320px] rounded-full bg-brand-accent/15 blur-3xl"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-card border border-brand-primary/30 text-brand-primary text-xs sm:text-sm font-medium shadow-purple-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{landing.heroBadge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text leading-tight">
              {landing.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl mx-auto">
              {landing.heroSubtitle}
            </p>

            <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-primary/90 font-semibold">
              “{brand.tagline}”
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-base transition-colors shadow-purple"
              >
                <span>{landing.ctaFindWork}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/jobs/new"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-card hover:bg-brand-primary/15 text-brand-text border border-brand-primary/30 font-semibold text-base transition-colors"
              >
                <Briefcase className="w-4 h-4 text-brand-primary" />
                <span>{landing.ctaPostJob}</span>
              </Link>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-primary/20 shadow-purple-sm text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                15–30 daq
              </p>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted">
                {landing.stats.microTasks}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-primary/20 shadow-purple-sm text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                Ona rejimi
              </p>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted">
                Moslashuvchan ish soatlari
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-primary/20 shadow-purple-sm text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                100% O&apos;zbekcha
              </p>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted">
                Tushunarli va qulay interfeys
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-primary/20 shadow-purple-sm text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                Maxfiy & Xavfsiz
              </p>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted">
                {landing.stats.safeEnv}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MUAMMO VA YECHIM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Muammo */}
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-card/90 border border-red-400/20 space-y-5">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-400/20">
              Mavjud muammolar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
              {landing.problemTitle}
            </h2>
            <div className="space-y-4">
              {landing.problems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-brand-bg/70 border border-brand-primary/10"
                >
                  <h3 className="font-semibold text-brand-text text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Yechim / Afzalliklar */}
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/35 shadow-purple space-y-5">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
              Digital She yechimi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
              {landing.solutionTitle}
            </h2>
            <div className="space-y-4">
              {landing.solutions.map((item, idx) => {
                const icons = [Clock, Zap, ShieldCheck];
                const Icon = icons[idx] || Sparkles;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-brand-bg/80 border border-brand-primary/20 flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text text-base">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-brand-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* QANDAY ISHLAYDI (3 QADAM) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            3 oddiy qadam
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-text">
            {landing.howItWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {landing.howItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-brand-card border border-brand-primary/20 shadow-purple-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-accent/20 border border-brand-primary/40 font-serif text-lg font-bold text-brand-primary">
                  {step.step}
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-text">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KIMLAR UCHUN (FRILANSER / BUYURTMACHI) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Ikki tomonlama manfaat
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-text">
            {landing.audienceTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frilanser uchun */}
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/30 shadow-purple-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-semibold">
                <HeartHandshake className="w-4 h-4" />
                <span>{landing.forFreelancers.badge}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-text">
                {landing.forFreelancers.title}
              </h3>
              <ul className="space-y-3">
                {landing.forFreelancers.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-brand-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/register?role=freelancer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-sm transition-colors"
            >
              <span>{landing.forFreelancers.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Buyurtmachi uchun */}
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-semibold">
                <Users className="w-4 h-4" />
                <span>{landing.forClients.badge}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-text">
                {landing.forClients.title}
              </h3>
              <ul className="space-y-3">
                {landing.forClients.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-brand-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/register?role=client"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-brand-bg hover:bg-brand-primary/20 text-brand-text border border-brand-primary/35 font-semibold text-sm transition-colors"
            >
              <span>{landing.forClients.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Savol-javoblar
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-text">
            {landing.faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {landing.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-brand-card border border-brand-primary/20 space-y-2"
            >
              <h3 className="font-semibold text-base sm:text-lg text-brand-text flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-brand-card via-brand-card to-brand-accent/20 border border-brand-primary/35 shadow-purple text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-text">
            Digital She hamjamiyatiga bugun qo&apos;shiling
          </h2>
          <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto">
            Moslashuvchan grafikda ishlashni xohlaysizmi yoki ishonchli ijrochi
            qidiryapsizmi? Hoziroq bepul ro&apos;yxatdan o&apos;ting.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-base transition-colors"
            >
              <span>Bepul ro&apos;yxatdan o&apos;tish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-bg/80 hover:bg-brand-bg text-brand-text border border-brand-primary/30 font-semibold text-base transition-colors"
            >
              <span>Ochiq ishlarni ko&apos;rish</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
