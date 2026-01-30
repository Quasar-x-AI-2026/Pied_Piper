import { useState } from 'react';
import { Transaction, TransactionCategory } from '@/types';
import { Plus, X } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onClose: () => void;
}

const categories: { value: TransactionCategory; label: string; type: 'income' | 'expense' | 'both' }[] = [
  { value: 'salary', label: 'Salary', type: 'income' },
  { value: 'investment', label: 'Investment Returns', type: 'income' },
  { value: 'food', label: 'Food & Dining', type: 'expense' },
  { value: 'rent', label: 'Rent & Utilities', type: 'expense' },
  { value: 'travel', label: 'Travel & Transport', type: 'expense' },
  { value: 'education', label: 'Education', type: 'expense' },
  { value: 'health', label: 'Health & Medical', type: 'expense' },
  { value: 'other', label: 'Other', type: 'both' },
];

export function TransactionForm({ onAdd, onClose }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<TransactionCategory>('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filteredCategories = categories.filter(
    c => c.type === 'both' || c.type === type
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      amount: parseFloat(amount),
      type,
      category,
      notes: notes.trim() || undefined
    });
    setAmount('');
    setType('expense');
    setCategory('other');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  return (
    <div className="card-elevated p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add Transaction</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory('other'); }}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === 'expense' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory('salary'); }}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === 'income' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Budget
          </button>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            required
            className="input-clean text-lg font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="input-clean"
          >
            {filteredCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input-clean"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note..."
            className="input-clean"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          <Plus className="w-4 h-4" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
}