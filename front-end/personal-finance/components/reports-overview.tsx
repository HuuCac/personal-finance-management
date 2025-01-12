'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeExpenseChart from "./charts/income-expense-chart";
import ExpenseCategoryChart from "./charts/expense-category-chart";

// Define types for the API data
interface MonthlyData {
  [key: string]: {
    income: number;
    expense: number;
  };
}

interface CategoryData {
  [key: string]: {
    income: number;
    expense: number;
  };
}

interface MonthlyReportResponse {
  monthlyData: MonthlyData;
}

interface CategoryReportResponse {
  categoryData: CategoryData;
}

export default function ReportsOverview() {
  const [monthlyData, setMonthlyData] = useState<MonthlyReportResponse | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch monthly and category reports
        const [monthlyRes, categoryRes] = await Promise.all([
          fetch("http://localhost:3005/api/reports/monthly", { headers }),
          fetch("/api/reports/byCategory", { headers }),
        ]);

        if (!monthlyRes.ok || !categoryRes.ok) {
          throw new Error("Failed to fetch reports");
        }

        const monthly = (await monthlyRes.json()) as MonthlyReportResponse;
        const category = (await categoryRes.json()) as CategoryReportResponse;

        setMonthlyData(monthly);
        setCategoryData(category);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="space-y-4">
        
      </TabsContent>
      <TabsContent value="quarterly">
        <div>Quarterly data will go here...</div>
      </TabsContent>
      <TabsContent value="yearly">
        <div>Yearly data will go here...</div>
      </TabsContent>
    </Tabs>
  );
}
