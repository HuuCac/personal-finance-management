'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, User, CreditCard } from 'lucide-react';

export default function AccountSettings() {
  const [notifications, setNotifications] = useState(true);
  const [transactionNotifications, setTransactionNotifications] = useState(true);

  useEffect(() => {
    const savedTransactionNotifications = localStorage.getItem('transactionNotifications') === 'true';
    setTransactionNotifications(savedTransactionNotifications);
  }, []);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('transactionNotifications', transactionNotifications.toString());
    console.log('Notification settings saved');
  };

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="profile">
          <User className="w-4 h-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security">
          <Lock className="w-4 h-4 mr-2" />
          Security
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <form onSubmit={handleSaveNotifications}>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="transaction-notifications">Transaction Notifications</Label>
                <Switch
                  id="transaction-notifications"
                  checked={transactionNotifications}
                  onCheckedChange={setTransactionNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Preferences</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
