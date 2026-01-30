import { useState, useMemo } from 'react';
import { Scheme, SchemeFilters as FiltersType } from '@/types';
import { schemesData } from '@/data/schemes';
import { SchemeFilters } from './SchemeFilters';
import { SchemeCard } from './SchemeCard';
import { SchemeDetail } from './SchemeDetail';
import { Search } from 'lucide-react';

interface SchemeLookupProps {
  onNavigateToChat: (query: string) => void;
}

export function SchemeLookup({ onNavigateToChat }: SchemeLookupProps) {
  const [filters, setFilters] = useState<FiltersType>({});
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const filteredSchemes = useMemo(() => {
    return schemesData.filter(scheme => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          scheme.name.toLowerCase().includes(searchLower) ||
          scheme.description.toLowerCase().includes(searchLower) ||
          scheme.targetBeneficiary.toLowerCase().includes(searchLower) ||
          scheme.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.category && scheme.category !== filters.category) return false;

      if (filters.type && scheme.type !== filters.type) return false;

      if (filters.state && scheme.type === 'state' && scheme.state !== filters.state) return false;

      if (filters.gender && scheme.gender && scheme.gender !== 'any' && scheme.gender !== filters.gender) return false;

      if (filters.ageRange) {
        if (filters.ageRange.min !== undefined && scheme.ageRange?.max !== undefined && scheme.ageRange.max < filters.ageRange.min) {
          return false;
        }
        if (filters.ageRange.max !== undefined && scheme.ageRange?.min !== undefined && scheme.ageRange.min > filters.ageRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleAskInChat = (scheme: Scheme) => {
    setSelectedScheme(null);
    onNavigateToChat(`Tell me more about ${scheme.name} and check my eligibility`);
  };

  return (
    <div className="container-app py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Government Schemes</h1>
        <p className="text-muted-foreground">Discover and explore central & state government schemes</p>
      </div>

      <SchemeFilters filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredSchemes.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">No schemes found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSchemes.map(scheme => (
            <SchemeCard 
              key={scheme.id} 
              scheme={scheme} 
              onSelect={setSelectedScheme} 
            />
          ))}
        </div>
      )}

      {selectedScheme && (
        <SchemeDetail
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onAskInChat={handleAskInChat}
        />
      )}

      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Information is collected from official sources. Always verify with official websites before applying.</p>
      </div>
    </div>
  );
}