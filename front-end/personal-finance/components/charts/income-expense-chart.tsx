import ReactECharts from 'echarts-for-react';

interface IncomeExpenseChartProps {
  data: {
    [key: string]: {
      income: number;
      expense: number;
    };
  } | null;
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Extract months and corresponding income/expense/net values from the data
  const months = Object.keys(data);
  const incomeData = months.map((month) => data[month].income);
  const expenseData = months.map((month) => data[month].expense);
  const netData = months.map(
    (month) => data[month].income - data[month].expense
  );

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ['Income', 'Expenses', 'Net'],
    },
    xAxis: [
      {
        type: 'category',
        data: months,
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Amount',
        min: 0,
        axisLabel: {
          formatter: '${value}',
        },
      },
    ],
    series: [
      {
        name: 'Income',
        type: 'bar',
        data: incomeData,
      },
      {
        name: 'Expenses',
        type: 'bar',
        data: expenseData,
      },
      {
        name: 'Net',
        type: 'line',
        data: netData,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default IncomeExpenseChart;
