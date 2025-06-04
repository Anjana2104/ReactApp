import { useState } from "react";
import { Card, Modal, Table, Button } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DemandBySpace = ({ data, setSelectedSpace }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRecords, setModalRecords] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const groupBy = (array, key) =>
    array.reduce((acc, curr) => {
      const val = curr[key] || "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const activeData = data.filter(item => {
    const status = (item["Candidate Status"] || "").toLowerCase();
    return status === "joined" || status === "selected" || status === "offered";
  });

  const getChartData = field =>
    Object.entries(groupBy(activeData, field)).map(([name, value]) => ({ name, value }));

  const handleBarClick = (e) => {
    if (e && e.activeLabel) {
      const matchingRecords = activeData.filter(item => item["Client Space"] === e.activeLabel);
      setModalTitle(`Demands for "${e.activeLabel}"`);
      setModalRecords(matchingRecords);
      setIsModalOpen(true);
      setSelectedSpace?.(e.activeLabel); // optional: trigger external filter
    }
  };

  return (
    <>
      <Card
        title="Active Resources by Spaces"
        extra={
          <Button type="link" onClick={() => {
            setModalTitle("All Active Demands");
            setModalRecords(activeData);
            setIsModalOpen(true);
          }}>
            View All
          </Button>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getChartData("Client Space")}
            margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
            onClick={handleBarClick}
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
            <Bar dataKey="value" fill="#8884d8" name="Active Demands" cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="90%"
      >
        <Table
          dataSource={modalRecords.map((r, i) => ({ ...r, key: r.key || i }))}
          columns={modalRecords.length ? Object.keys(modalRecords[0]).map(key => ({
            title: key,
            dataIndex: key,
          })) : []}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Modal>
    </>
  );
};

export default DemandBySpace;
