
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

const DemandBySpaces = ({data,setSelectedSpace}) => {
 
  const groupBy = (array, key) =>
    array.reduce((acc, curr) => {
      const val = curr[key] || "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const activeData = data.filter(item => {
      const status = (item["Candidate Status"] || "").toLowerCase();
      // console.log("Status = ",status)
      return status === "joined" || status === "selected" || status === "offered";
    });

  const getChartData = field =>
    Object.entries(groupBy(activeData, field)).map(([name, value]) => ({ name, value }));

  return (
    <Card title="Demand by Spaces">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={getChartData("Client Space")}
          margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
          onClick={(e) => {
            if (e && e.activeLabel) setSelectedSpace(e.activeLabel);
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
          <Bar dataKey="value" fill="#8884d8" name="Demand Count" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DemandBySpaces;