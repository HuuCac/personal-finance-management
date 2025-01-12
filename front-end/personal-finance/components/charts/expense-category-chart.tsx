import ReactECharts from 'echarts-for-react';

interface ExpenseCategoryChartProps {
  data: {
    [key: string]: {
      income: number;
      expense: number;
    };
  } | null;
}

const ExpenseCategoryChart: React.FC<ExpenseCategoryChartProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Transform data for the pie chart
  const chartData = Object.keys(data).map((category) => ({
    name: category,
    value: data[category].expense,
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: chartData.map((item) => item.name), // Legend uses category names
    },
    series: [
      {
        name: 'Expense Categories',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData, // Pie chart data
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default ExpenseCategoryChart;
