import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Search, Check } from 'lucide-react';

const plans = [
  {
    name: 'free',
    label: 'Free',
    description: '1 user, 3 searches/week',
    features: ['Basic search functionality', 'Limited to 3 searches per week', '1 team member'],
  },
  {
    name: 'basic',
    label: 'Basic',
    description: '3 users, unlimited searches',
    features: ['Unlimited searches', 'AI summaries', 'Readiness checks', 'Up to 3 team members'],
  },
  {
    name: 'pro',
    label: 'Pro',
    description: 'Unlimited users, all features',
    features: ['All Basic features', 'Unlimited team members', 'Export reports', 'Priority support'],
  },
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    plan: 'free' as 'free' | 'basic' | 'pro',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to Tender Insight Hub. You can now start exploring tenders.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center shadow-elegant">
              <Search className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient">Join Tender Insight Hub</h1>
          <p className="text-muted-foreground mt-2">
            Start discovering tender opportunities for your business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@company.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => updateFormData('organizationName', e.target.value)}
                    placeholder="Acme Construction Ltd"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan">Select Plan</Label>
                  <Select value={formData.plan} onValueChange={(value) => updateFormData('plan', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.name} value={plan.name}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{plan.label}</span>
                            <span className="text-muted-foreground">- {plan.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose the right plan for your team</h3>
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`cursor-pointer transition-all ${
                  formData.plan === plan.name 
                    ? 'ring-2 ring-primary shadow-elegant' 
                    : 'hover:shadow-card'
                }`}
                onClick={() => updateFormData('plan', plan.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{plan.label}</h4>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {formData.plan === plan.name && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}