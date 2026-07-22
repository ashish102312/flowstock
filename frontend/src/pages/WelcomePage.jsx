import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

export default function WelcomePage() {
  const highlights = [
    { icon: Workflow, title: 'Warehouse coordination', text: 'Align inventory movement, storage zones, and fulfillment tasks through one dependable system.' },
    { icon: ShieldCheck, title: 'Secure operations', text: 'Protect every workflow with trusted authentication and role-based access controls.' },
    { icon: BarChart3, title: 'Operational visibility', text: 'Monitor activity and keep teams informed with a clear, systematic view of progress.' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#1e1b4b_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-8 lg:py-8">
        <header className="animate-fade-in flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/90 shadow-lg shadow-brand-950/30">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-brand-200 uppercase">FlowStock</p>
              <p className="text-xs text-white/50">Inventory operations</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
              Sign in
            </Link>
            <Link to="/register" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
              Get started
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 items-center py-10 lg:py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="animate-slide-up space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-200 animate-pulse-subtle">
                <Sparkles className="h-4 w-4" />
                Modern inventory and fulfillment platform
              </div>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Streamline stock, movement, and delivery with FlowStock.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-white/65">
                  FlowStock helps teams manage inventory, warehouse activity, and fulfillment operations through one clear and dependable workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg shadow-brand-900/30">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="btn-ghost inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                  Explore dashboard
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Built for daily operations', value: 'Reliable' },
                  { label: 'Made for growing teams', value: 'Scalable' },
                  { label: 'Focused on clarity', value: 'Structured' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                    <p className="text-xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-white/45">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="auth-card animate-slide-up p-6 sm:p-8 lg:p-8">
              <div className="space-y-6">
                <div className="rounded-2xl border border-brand-400/20 bg-brand-500/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">Why teams choose FlowStock</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xl font-semibold text-white">Designed for modern warehouse operations</p>
                    <p className="text-sm text-white/60">A calm experience for teams that need structure, speed, and dependable coordination.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {highlights.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-brand-400/30 hover:bg-brand-500/10">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/60">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
