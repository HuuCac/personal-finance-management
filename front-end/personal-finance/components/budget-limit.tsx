'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import * as echarts from 'echarts'

// Định nghĩa kiểu dữ liệu cho đối tượng budget
interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export default function BudgetLimit() {
  // Khai báo state với kiểu dữ liệu Budget[]
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "Food", limit: 500, spent: 350 },
    { category: "Transportation", limit: 300, spent: 200 },
    { category: "Entertainment", limit: 200, spent: 180 },
    { category: "Shopping", limit: 400, spent: 150 },
  ])
  
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newLimit, setNewLimit] = useState<string>("")
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)

      const categories = budgets.map((budget) => budget.category)
      const spentData = budgets.map((budget) => budget.spent)
      const limitData = budgets.map((budget) => budget.limit)

      const option = {
        title: {
          text: 'Budget vs Spent',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: categories
        },
        series: [
          {
            name: 'Spent',
            type: 'bar',
            data: spentData,
            itemStyle: {
              color: '#4caf50', // Màu cho phần chi tiêu (spent)
            }
          },
          {
            name: 'Limit',
            type: 'bar',
            data: limitData,
            itemStyle: {
              color: '#f44336', // Màu đỏ cho phần giới hạn (limit)
            }
          }
        ]
      }

      chart.setOption(option)
    }

    return () => {
      if (chartRef.current) {
        echarts.dispose(chartRef.current)
      }
    }
  }, [budgets])

  const handleEditLimit = (category: string) => {
    setEditingCategory(category)
    const currentLimit = budgets.find(b => b.category === category)?.limit
    setNewLimit(currentLimit?.toString() || "")
  }

  const handleSaveLimit = () => {
    if (editingCategory !== null && newLimit) {
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget.category === editingCategory
            ? { ...budget, limit: parseFloat(newLimit) }
            : budget
        )
      )
      setEditingCategory(null)
      setNewLimit("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Limits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div ref={chartRef} style={{ width: '100%', height: 400 }}></div>
        </div>

        {/* Combobox (dropdown) để chọn danh mục chỉnh sửa */}
        <div className="mt-4">
          <select
            value={editingCategory || ""}
            onChange={(e) => handleEditLimit(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="" disabled>Select Category</option>
            {budgets.map((budget) => (
              <option key={budget.category} value={budget.category}>
                {budget.category}
              </option>
            ))}
          </select>
        </div>

        {/* Hiển thị form chỉnh sửa giới hạn khi chọn danh mục */}
        {editingCategory && (
          <div className="mt-4">
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter new limit"
            />
            <Button
              className="mt-2"
              onClick={handleSaveLimit}
            >
              Save New Limit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
