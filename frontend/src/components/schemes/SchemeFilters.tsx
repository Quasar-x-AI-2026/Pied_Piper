import { useState } from 'react';
import { SchemeFilters as FiltersType, SchemeCategory } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface SchemeFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

const categories: { value: SchemeCategory; label: string }[] = [
  { value: 'education', label: 'Education' },
  { value: 'housing', label: 'Housing' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'women', label: 'Women & Child' },
  { value: 'senior', label: 'Senior Citizens' },
  { value: 'employment', label: 'Employment' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance & Savings' },
];

const states = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export function SchemeFilters({ filters, onFiltersChange }: SchemeFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search schemes by name or keyword…"
          className="input-clean pl-10 pr-4"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(['all', 'central', 'state'] as const).map((type) => (
            <button
              key={type}
              onClick={() => updateFilter('type', type === 'all' ? undefined : type)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                (type === 'all' && !filters.type) || filters.type === type
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', filters.category === cat.value ? undefined : cat.value)}
              className={`filter-tag ${filters.category === cat.value ? 'filter-tag-active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Filter className="w-4 h-4" />
        {showAdvanced ? 'Hide' : 'Show'} advanced filters
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl animate-fade-in">
          <div className="space-y-1">
            <label className="text-sm font-medium">State</label>
            <select
              value={filters.state || ''}
              onChange={(e) => updateFilter('state', e.target.value || undefined)}
              className="input-clean"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Gender</label>
            <select
              value={filters.gender || ''}
              onChange={(e) =>
                updateFilter('gender', e.target.value as 'male' | 'female' | 'any' || undefined)
              }
              className="input-clean"
            >
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Age Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={filters.ageRange?.min || ''}
                onChange={(e) =>
                  updateFilter('ageRange', {
                    ...filters.ageRange,
                    min: e.target.value ? parseInt(e.target.value) : undefined
                  })
                }
                className="input-clean"
              />
              <input
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={filters.ageRange?.max || ''}
                onChange={(e) =>
                  updateFilter('ageRange', {
                    ...filters.ageRange,
                    max: e.target.value ? parseInt(e.target.value) : undefined
                  })
                }
                className="input-clean"
              />
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-destructive hover:underline"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
