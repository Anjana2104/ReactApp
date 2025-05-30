import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const ResourceByRoleChart = ({
  setSelectedRole,
  available
}) => {
  const groupBy = (array, key) =>
    array.reduce((acc, curr) => {
      const val = curr[key] || "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const getChartData = field =>
    Object.entries(groupBy(available, field)).map(([name, value]) => ({ name, value }));

  return (
    <Card title="Available Resources by Role">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={getChartData("Role")}
          margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
          onClick={(e) => {
            if (e && e.activeLabel) setSelectedRole(e.activeLabel);
          }}
        >
          <XAxis 
            dataKey="name"
            interval={0}
            angle={-45}
            textAnchor="end"
            scale="band"
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          <Bar dataKey="value" fill="#8884d8" name="Resource Count" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ResourceByRoleChart;
