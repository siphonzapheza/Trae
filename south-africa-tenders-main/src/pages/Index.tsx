import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Users, BarChart3, CheckCircle, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 gradient-hero rounded-3xl flex items-center justify-center shadow-elegant animate-scale-in">
                <Search className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gradient mb-6 animate-slide-up">
              Tender Insight Hub
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
              AI-powered platform helping South African SMEs discover, analyze, and win 
              public procurement opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link to="/register">
                <Button size="lg" className="btn-primary text-lg px-8 shadow-glow">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 glass">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-slide-up">
              Everything you need to win tenders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
              From discovery to submission, our platform guides you through every step
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {[
              {
                icon: Search,
                title: "Smart Search & Filtering",
                description: "Find relevant tenders with AI-powered keyword matching and advanced filters"
              },
              {
                icon: Brain,
                title: "AI Document Analysis",
                description: "Get plain-language summaries of complex tender documents in seconds"
              },
              {
                icon: BarChart3,
                title: "Readiness Scoring",
                description: "Know your chances with automated suitability assessments"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together with notes, tasks, and status tracking"
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Never miss deadlines with automated notifications"
              },
              {
                icon: Shield,
                title: "OCDS Integration",
                description: "Direct access to official government tender data"
              }
            ].map((feature, index) => (
              <Card key={index} className="card-elevated hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary-foreground group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-slide-up">Choose your plan</h2>
            <p className="text-xl text-muted-foreground animate-slide-up" style={{animationDelay: '0.1s'}}>Start free, scale as you grow</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
            {[
              {
                name: "Free",
                price: "R0",
                description: "Perfect for getting started",
                features: ["1 team member", "3 searches per week", "Basic search filters"],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Basic",
                price: "R299",
                description: "For growing businesses",
                features: ["Up to 3 team members", "Unlimited searches", "AI summaries", "Readiness scoring"],
                cta: "Start Trial",
                popular: true
              },
              {
                name: "Pro",
                price: "R599",
                description: "For established teams",
                features: ["Unlimited team members", "All Basic features", "Export reports", "Priority support"],
                cta: "Start Trial",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`card-elevated relative group hover:shadow-glow transition-all duration-300 ${plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : 'hover:scale-105'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-hero text-primary-foreground shadow-glow">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button 
                      className={plan.popular ? 'btn-primary w-full shadow-glow' : 'w-full'} 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-slide-up">
            Ready to win more tenders?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
            Join hundreds of SMEs already using our platform to grow their business
          </p>
          <Link to="/register">
            <Button size="lg" className="glass hover:bg-white/20 text-primary-foreground border-white/20 text-lg px-8 shadow-glow animate-scale-in" style={{animationDelay: '0.2s'}}>
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
