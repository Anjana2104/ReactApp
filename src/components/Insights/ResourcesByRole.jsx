import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


const ResourceByRoleChart = ({
  setSelectedRole,
  getChartData
}) => {
  return (
    <Card title="Available Resources by Role">
      <BarChart
        width={500}
        height={300}
        data={getChartData("Role")}
        onClick={(e) => {
          if (e && e.activeLabel) setSelectedRole(e.activeLabel);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Resources" />
      </BarChart>
    </Card>
  );
};

export default ResourceByRoleChart;
