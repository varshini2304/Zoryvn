import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-mist text-ink">
      
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sea/20 blur-[120px]" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-ember/20 blur-[140px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center lg:py-28">
          
          <div className="max-w-xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Finance Dashboard System
            </p>

            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Build{" "}
              <span className="bg-gradient-to-r from-sea to-emerald-400 bg-clip-text text-transparent">
                production-grade finance systems
              </span>{" "}
              with real-time insights & secure APIs.
            </h1>

            <p className="text-sm text-slate-600 md:text-base">
              A backend-focused system designed for real-world scalability —
              featuring role-based access, audit trails, caching, and
              high-performance APIs.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Live Demo</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-slate-500 pt-2">
              <span>🔐 JWT Security</span>
              <span>⚡ Redis Caching</span>
              <span>📊 Real-time Analytics</span>
            </div>
          </div>

          {/* FEATURE GRID */}
          <div className="grid w-full gap-4 md:grid-cols-2">
            {[
              {
                title: "Role-aware system",
                body: "Admin, Analyst, Viewer — each role dynamically controls API access and UI behavior."
              },
              {
                title: "Smart dashboards",
                body: "Track trends, category performance, and financial health in real time."
              },
              {
                title: "Audit logging",
                body: "Every action is tracked for transparency and debugging."
              },
              {
                title: "Resilient backend",
                body: "Cache-first architecture ensures performance even during failures."
              }
            ].map((item) => (
              <Card
                key={item.title}
                className="space-y-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST SECTION */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>Built with PostgreSQL</span>
          <span>•</span>
          <span>Deployed on Render</span>
          <span>•</span>
          <span>Redis via Upstash</span>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-6xl space-y-10 px-6 pb-20">

        {/* HOW / WHAT / WHY */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="space-y-3 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>1. Secure login with JWT authentication</li>
              <li>2. Track income & expenses with categories</li>
              <li>3. Analyze dashboards & export reports</li>
            </ol>
          </Card>

          <Card className="space-y-3 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Capabilities</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Real-time financial tracking</li>
              <li>Advanced filtering & search</li>
              <li>CSV export for reporting</li>
            </ul>
          </Card>

          <Card className="space-y-3 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Why it stands out</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>RBAC ensures strict data isolation</li>
              <li>Optimized DB queries for performance</li>
              <li>Redis improves latency significantly</li>
            </ul>
          </Card>
        </div>

        {/* ARCHITECTURE */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Architecture</h3>
            <p className="text-sm text-slate-600">
              A cloud-native backend deployed on Render, powered by Neon PostgreSQL,
              and accelerated using Upstash Redis caching.
            </p>

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">Render</div>
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">Neon</div>
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">Upstash</div>
            </div>
          </Card>

          <Card className="space-y-4 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">API Health</h3>
            <p className="text-sm text-slate-600">
              Includes health monitoring and Swagger documentation for quick testing.
            </p>

            <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-white">
              GET /api/v1/health → {"{"}"status":"ok","services":{"{...}"}{"}"}
            </div>

            <div className="text-xs text-slate-500">
              Swagger: /api/v1/docs
            </div>
          </Card>
        </div>

        {/* FINAL CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Ready to explore the system?
          </h2>
          <p className="text-sm text-slate-600">
            Experience real-time finance tracking with production-grade backend architecture.
          </p>

          <div className="flex justify-center gap-3">
            <Link to="/register">
              <Button>Start Now</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">View Demo</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;