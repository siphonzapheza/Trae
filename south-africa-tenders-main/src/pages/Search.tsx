import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tender, SearchFilters } from '@/types';
import { tendersAPI } from '@/services/api';
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  FileText,
  Bookmark,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

const categories = [
  'Construction', 'ICT', 'Security', 'Infrastructure', 'Fleet Management',
  'Consulting', 'Engineering', 'Maintenance', 'Services', 'Equipment'
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

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

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      const searchFilters: SearchFilters = {
        keywords: searchQuery.trim() || undefined,
        ...filters
      };
      
      const results = await tendersAPI.getTenders(searchFilters);
      setFilteredTenders(results);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} tender${results.length !== 1 ? 's' : ''} matching your criteria.`,
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "There was an error searching for tenders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleProvinceFilter = (province: string) => {
    const currentProvinces = filters.provinces || [];
    const newProvinces = currentProvinces.includes(province)
      ? currentProvinces.filter(p => p !== province)
      : [...currentProvinces, province];
    updateFilter('provinces', newProvinces);
  };

  const toggleCategoryFilter = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    updateFilter('categories', newCategories);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    handleSearch();
  };

  const handleSaveTender = async (tenderId: string) => {
    toast({
      title: "Tender saved",
      description: "This tender has been added to your workspace.",
    });
  };

  const handleAIAnalysis = async (tenderId: string) => {
    try {
      toast({
        title: "AI Analysis requested",
        description: "Generating summary and readiness score...",
      });
      
      const analysis = await tendersAPI.analyzeTender(tenderId);
      
      toast({
        title: "AI Analysis completed",
        description: `Readiness score: ${analysis.readinessScore.score}%. ${analysis.readinessScore.recommendation}`,
      });
    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the tender. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Search Tender Opportunities</h1>
        <p className="text-muted-foreground">
          Discover government and public sector tenders relevant to your business
        </p>
      </div>

      {/* Search Bar */}
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by keywords (e.g. 'road construction', 'ICT services')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              <Button onClick={handleSearch} disabled={isLoading} className="btn-primary">
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Budget Range */}
                <div className="space-y-2">
                  <Label>Budget Range (ZAR)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin || ''}
                      onChange={(e) => updateFilter('budgetMin', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax || ''}
                      onChange={(e) => updateFilter('budgetMax', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Deadline Range */}
                <div className="space-y-2">
                  <Label>Deadline Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={filters.deadlineFrom || ''}
                      onChange={(e) => updateFilter('deadlineFrom', e.target.value)}
                    />
                    <Input
                      type="date"
                      value={filters.deadlineTo || ''}
                      onChange={(e) => updateFilter('deadlineTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Provinces */}
              <div className="space-y-2">
                <Label>Provinces</Label>
                <div className="flex flex-wrap gap-2">
                  {provinces.map(province => (
                    <div key={province} className="flex items-center space-x-2">
                      <Checkbox
                        id={`province-${province}`}
                        checked={filters.provinces?.includes(province) || false}
                        onCheckedChange={() => toggleProvinceFilter(province)}
                      />
                      <Label htmlFor={`province-${province}`} className="text-sm font-normal">
                        {province}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories?.includes(category) || false}
                        onCheckedChange={() => toggleCategoryFilter(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''} found
        </h2>
        <div className="text-sm text-muted-foreground">
          Sorted by relevance
        </div>
      </div>

      {/* Tender Cards */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => {
          const daysLeft = getDaysUntilDeadline(tender.deadline);
          const isUrgent = daysLeft <= 7;
          
          return (
            <Card key={tender.id} className="card-elevated hover:shadow-elegant transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {tender.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="truncate">{tender.buyer}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{tender.province}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatCurrency(tender.budget.min || 0)} - {formatCurrency(tender.budget.max || 0)}</span>
                          </div>
                          <div className={`flex items-center text-sm ${isUrgent ? 'text-destructive' : ''}`}>
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{daysLeft} days left</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {tender.categories.map(category => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                          {isUrgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 lg:min-w-[140px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveTender(tender.id)}
                      className="flex items-center"
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAIAnalysis(tender.id)}
                      className="btn-accent flex items-center"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI Analysis
                    </Button>
                    {tender.documents && tender.documents.length > 0 && (
                      <Button size="sm" variant="outline" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {tender.documents.length} Doc{tender.documents.length !== 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTenders.length === 0 && !isLoading && (
        <Card className="card-elevated">
          <CardContent className="p-12 text-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tenders found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find relevant opportunities.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters and Search Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}