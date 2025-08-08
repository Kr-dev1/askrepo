"use client"

import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Lander() {
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLElement>(null);
    const ctaRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Simple fade-in animations
        const animateElement = (element: any, delay = 0) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        };

        animateElement(heroRef.current, 100);
        animateElement(featuresRef.current, 300);
        animateElement(ctaRef.current, 500);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]"></div>

            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-screen max-w-6xl mx-auto">
                {/* Hero Section */}
                <section ref={heroRef} className="flex flex-col items-center text-center gap-8 max-w-4xl">
                    {/* Simple logo */}
                    <div className="bg-primary rounded-2xl p-6 shadow-lg">
                        <svg className="w-16 h-16 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    {/* Clean typography */}
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                            AskRepo
                        </h1>
                        <h2 className="text-xl sm:text-2xl text-muted-foreground font-medium">
                            Your AI-Powered Codebase Assistant
                        </h2>
                    </div>

                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Instantly search, understand, and get answers from your codebase.
                        Supercharge your productivity with AI-driven insights and seamless code navigation.
                    </p>

                    {/* Clean CTA */}
                    <div className="mt-8">
                        <Link href="/signup">
                            <Button className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-lg shadow-lg transition-colors duration-200 hover:shadow-xl">
                                Get Started Free
                            </Button>
                        </Link>
                        <p className="text-muted-foreground text-sm mt-3">No credit card required</p>
                    </div>
                </section>

                {/* Clean Features Section */}
                <section ref={featuresRef} className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl mx-auto">
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-chart-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            title: "Natural Language Q&A",
                            description: "Ask questions about your codebase in plain English and get instant, context-aware answers powered by AI."
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-chart-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            ),
                            title: "Smart Code Discovery",
                            description: "Quickly locate functions, classes, and dependencies. Navigate complex codebases with intelligent semantic search."
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-chart-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            ),
                            title: "Lightning Fast",
                            description: "Blazing fast responses with real-time indexing. Integrates seamlessly with your existing development workflow."
                        }
                    ].map((feature, index) => (
                        <div key={index} className="bg-card rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-col items-center text-center space-y-3 lg:space-y-4">
                                <div className="p-2 lg:p-3 bg-muted rounded-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-base lg:text-lg text-card-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Simple CTA Section */}
                <section ref={ctaRef} className="mt-20 text-center space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-foreground">
                            Ready to get started?
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join developers who are already using AskRepo to understand their codebases better.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/signup">
                            <Button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg transition-colors duration-200">
                                Create an Account
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mt-6">
                        <span>✓ Free Access</span>
                        <span>✓ No credit card required</span>
                        <span>✓ Setup in minutes</span>
                    </div>
                </section>
            </div>
        </div>
    );
}