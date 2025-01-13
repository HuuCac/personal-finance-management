'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Briefcase, ShoppingCart, Gift } from 'lucide-react';
import { FinanceTags } from './finance-tags';

const financeTags = [
  { id: 'income', name: 'Income', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'expense', name: 'Expense', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'investment', name: 'Investment', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'gift', name: 'Gift', icon: <Gift className="w-4 h-4" /> },
];

export default function AddNewForm() {
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3002/api/transactions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const showNotifications =
          localStorage.getItem('transactionNotifications') === 'true';
        if (showNotifications) {
          alert('Đã thêm thành công!');
        }
        router.push('/transactions');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while adding the transaction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/add');
    }
  }, [router]);

  const renderForm = () => {
    switch (selectedTag) {
      case 'income':
        return (
          <>
            <Input id="note" name="note" placeholder="Enter note name" required />
            <Input id="source" name="source" placeholder="Enter income source" required />
            <Input id="amount" name="amount" type="number" placeholder="Enter amount" required />
            <Input id="date" name="date" type="date" required />
          </>
        );
      case 'expense':
        return (
          <>
            <Select name="note">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent id="note">
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
            <Input id="amount" name="amount" type="number" placeholder="Enter amount" required />
            <Input id="date" name="date" type="date" required />
          </>
        );
      case 'investment':
        return (
          <>
            <Select name="note">
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent id="note">
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="bonds">Bonds</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
            <Input id="amount" name="amount" type="number" placeholder="Enter amount" required />
            <Input id="date" name="date" type="date" required />
          </>
        );
      case 'gift':
        return (
          <>
            <Input id="note" name="note" placeholder="Enter recipient or giver name" required />
            <Input id="amount" name="amount" type="number" placeholder="Enter amount or value" required />
            <Input id="date" name="date" type="date" required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <FinanceTags
          tags={financeTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
        {selectedTag && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {renderForm()}
            <input type="hidden" name="type" value={selectedTag} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
