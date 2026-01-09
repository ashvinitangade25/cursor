"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  GitBranch,
  Star,
  GitPullRequest,
  Package,
  TrendingUp,
  Zap,
  Shield,
  Code,
  ArrowRight,
  Github,
} from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-lg font-semibold">Dandi</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="" asChild>
              <Link href="/Dashbords">Dashboard</Link>
            </Button>
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="hidden sm:inline text-xs text-gray-600">
                  Loading...
                </span>
              </div>
            ) : session ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">
                      {session.user?.name || "User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {session.user?.email}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="mr-1 h-3 w-3" />
            Powered by GitHub API
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Deep insights for your GitHub repositories
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-balance md:text-xl">
            Get comprehensive analytics, track stars, monitor pull requests, and
            discover cool facts about any open source repository. All in one
            place.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {session ? (
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/Dashbords">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free tier available
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">10M+</div>
              <div className="text-sm text-muted-foreground">
                Repositories Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">500K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">24/7</div>
              <div className="text-sm text-muted-foreground">
                Real-time Updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything you need to analyze repositories
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Comprehensive insights and analytics for open source projects
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Star Tracking</h3>
              <p className="text-muted-foreground">
                Monitor star growth over time with detailed charts and
                historical data
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GitPullRequest className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">PR Insights</h3>
              <p className="text-muted-foreground">
                Stay updated with the latest and most important pull requests
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Version Updates</h3>
              <p className="text-muted-foreground">
                Never miss a release with automatic version tracking and
                notifications
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Cool Facts</h3>
              <p className="text-muted-foreground">
                Discover interesting statistics and trends about any repository
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Code Analytics</h3>
              <p className="text-muted-foreground">
                Deep dive into code metrics, languages, and contribution
                patterns
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Security Insights</h3>
              <p className="text-muted-foreground">
                Track security updates, vulnerabilities, and dependency alerts
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="border-t border-border bg-muted/30 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Free Tier */}
            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="mb-2 text-2xl font-bold">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Up to 10 repositories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Weekly updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Community support</span>
                  </li>
                </ul>
                {session ? (
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    asChild
                  >
                    <Link href="/Dashbords">Get Started</Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                  >
                    Get Started
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-primary shadow-lg">
              <CardContent className="p-8">
                <Badge variant="secondary" className="mb-2">
                  Most Popular
                </Badge>
                <h3 className="mb-2 text-2xl font-bold">Pro</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Unlimited repositories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Real-time updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Custom reports</span>
                  </li>
                </ul>
                {session ? (
                  <Button className="w-full" asChild>
                    <Link href="/Dashbords">Start Free Trial</Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                  >
                    Start Free Trial
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="mb-2 text-2xl font-bold">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">SLA guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">On-premise option</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-balance">
            Start analyzing repositories today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground text-balance">
            Join thousands of developers who trust Dandi for their GitHub
            analytics
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {session ? (
              <Button size="lg" className="" asChild>
                <Link href="/Dashbords">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className=""
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button size="lg" variant="outline" className="" asChild>
              <Link href="/Documentation">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Github className="h-5 w-5" />
                <span className="font-semibold">Dandi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Deep insights for GitHub repositories
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 Dandi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
