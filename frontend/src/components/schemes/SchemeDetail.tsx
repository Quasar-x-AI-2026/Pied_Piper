import { Scheme } from '@/types';
import { X, ExternalLink, FileText, CheckCircle, ArrowRight, Users, IndianRupee, Calendar, MessageCircle } from 'lucide-react';

interface SchemeDetailProps {
  scheme: Scheme;
  onClose: () => void;
  onAskInChat: (scheme: Scheme) => void;
}

export function SchemeDetail({ scheme, onClose, onAskInChat }: SchemeDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-elevated border border-border animate-slide-up">
        <div className="sticky top-0 bg-card rounded-t-2xl border-b border-border p-6 flex items-start justify-between gap-4 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={scheme.type === 'central' ? 'scheme-badge-central' : 'scheme-badge-state'}>
                {scheme.type === 'central' ? 'Central Govt.' : scheme.state || 'State Govt.'}
              </span>
              <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
                {scheme.category}
              </span>
            </div>
            <h2 className="text-xl font-bold leading-tight">{scheme.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Overview</h3>
            <p className="text-sm leading-relaxed">{scheme.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 text-secondary-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Target Beneficiary</span>
              </div>
              <p className="text-sm font-medium">{scheme.targetBeneficiary}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 text-primary mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Key Benefit</span>
              </div>
              <p className="text-sm font-semibold text-primary">{scheme.keyBenefit}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Eligibility Criteria
            </h3>
            <ul className="space-y-2">
              {scheme.eligibility.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Required Documents
            </h3>
            <div className="flex flex-wrap gap-2">
              {scheme.documents.map((doc, index) => (
                <span key={index} className="px-3 py-1 bg-muted text-sm rounded-full">
                  {doc}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              How to Apply
            </h3>
            <ol className="space-y-3">
              {scheme.applicationSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium">Official Source</p>
                <p className="text-xs text-muted-foreground truncate">{scheme.officialLink}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Last updated: {scheme.lastUpdated.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card rounded-b-2xl border-t border-border p-4 flex gap-3">
          <button
            onClick={() => onAskInChat(scheme)}
            className="btn-secondary flex-1"
          >
            <MessageCircle className="w-4 h-4" />
            Ask in Chat
          </button>
          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1"
            >
              <ExternalLink className="w-4 h-4" />
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
