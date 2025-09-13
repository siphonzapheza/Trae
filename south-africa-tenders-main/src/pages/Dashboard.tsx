import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/services/api';
import { 
  Search, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/services/api';

export default function Dashboard() {
  const { user, organization } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUsageProgress = () => {
    if (!organization) return 0;
    if (organization.plan === 'free') {
      // Mock: assume 2 searches used out of 3
      return (2 / 3) * 100;
    }
    return 0; // Unlimited for other plans
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-2xl p-8 text-primary-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              {organization?.name} • {organization?.plan.toUpperCase()} Plan
            </p>
            <p className="text-primary-foreground/70 mt-2">
              Discover new tender opportunities and grow your business
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Link to="/search">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20">
                Start Searching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Tenders</p>
                <p className="text-2xl font-bold">{stats.totalTenders}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saved Tenders</p>
                <p className="text-2xl font-bold">{stats.savedTenders}</p>
              </div>
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interested</p>
                <p className="text-2xl font-bold">{stats.interestedTenders}</p>
              </div>
              <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tenders */}
        <div className="lg:col-span-2">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Tenders
              </CardTitle>
              <CardDescription>
                Latest tender opportunities matching your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentTenders.map((tender) => (
                <div key={tender.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{tender.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tender.buyer} • {tender.province}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm font-medium text-success">
                          {formatCurrency(tender.budget.min || 0)} - {formatCurrency(tender.budget.max || 0)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(tender.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {tender.categories[0]}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link to="/search">
                  <Button variant="outline" className="w-full">
                    View All Tenders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Tracking */}
          {organization?.plan === 'free' && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Weekly Search Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>2 of 3 searches used</span>
                    <span>{Math.round(getUsageProgress())}%</span>
                  </div>
                  <Progress value={getUsageProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Resets every Monday. <Link to="/pricing" className="text-primary hover:underline">Upgrade</Link> for unlimited searches.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Urgent Deadlines */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Urgent Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.urgentDeadlines.length > 0 ? (
                stats.urgentDeadlines.map((tender) => {
                  const daysLeft = getDaysUntilDeadline(tender.deadline);
                  return (
                    <div key={tender.id} className="flex items-start space-x-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        daysLeft <= 7 ? 'bg-destructive' : daysLeft <= 14 ? 'bg-warning' : 'bg-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tender.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No urgent deadlines</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/search">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search Tenders
                </Button>
              </Link>
              <Link to="/workspace">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Workspace
                </Button>
              </Link>
              <Link to="/company">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}