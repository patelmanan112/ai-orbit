'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete company');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-400 disabled:opacity-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
