import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#FF6666"];

const ResourceStatusChart = ({ available, notavailable, reserved }) => (
  
  <Card title="Resource Status (All)">
    <PieChart width={400} height={300}>
      <Pie
        data={[
          { name: "Available", value: available.length },
          { name: "Not Available", value: notavailable.length },
          { name: "Reserved", value: reserved.length },
        ]}
        cx="50%"
        cy="50%"
        label
        outerRadius={100}
        dataKey="value"
      >
        {COLORS.map((color, index) => (
          <Cell key={index} fill={color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </Card>
);

export default ResourceStatusChart;
