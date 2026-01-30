import { Scheme } from '@/types';
import { ChevronRight, Users, IndianRupee, Calendar } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  onSelect: (scheme: Scheme) => void;
}

export function SchemeCard({ scheme, onSelect }: SchemeCardProps) {
  return (
    <div 
      className="card-interactive p-5 cursor-pointer group"
      onClick={() => onSelect(scheme)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-2">
            <span className={scheme.type === 'central' ? 'scheme-badge-central' : 'scheme-badge-state'}>
              {scheme.type === 'central' ? 'Central' : scheme.state || 'State'}
            </span>
            <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
              {scheme.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {scheme.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {scheme.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{scheme.targetBeneficiary}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="font-medium text-foreground">{scheme.keyBenefit}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
      </div>

      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>Updated: {scheme.lastUpdated.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
