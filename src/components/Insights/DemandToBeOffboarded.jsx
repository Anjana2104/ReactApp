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

const DemandToBeOffboarded = ({ data, setSelectedSpace }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRecords, setModalRecords] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const today = new Date();

  // Filter: only 'joined' and offboarding in past or next 30 days
  const filteredData = data.filter(item => {
    const status = (item["Candidate Status"] || "").toLowerCase();
    if (status !== "joined") return false;

    const offboardingStr = item["Expected Offboarding Date"];
    if (!offboardingStr) return false;

    const offboardingDate = new Date(offboardingStr);
    if (isNaN(offboardingDate)) return false;

    const diffInDays = (offboardingDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  });

  const groupBy = (array, key) =>
    array.reduce((acc, curr) => {
      const val = curr[key] || "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const getChartData = field =>
    Object.entries(groupBy(filteredData, field)).map(([name, value]) => ({
      name,
      value
    }));

  const handleBarClick = (e) => {
    if (e && e.activeLabel) {
      const matchingRecords = filteredData.filter(
        item => item["Client Space"] === e.activeLabel
      );
      setModalTitle(`Offboarding Resources for "${e.activeLabel}"`);
      setModalRecords(matchingRecords);
      setIsModalOpen(true);
      setSelectedSpace?.(e.activeLabel);
    }
  };

  return (
    <>
      <Card
        title="Resources To Be Offboarded (Past or Next 30 Days)"
        extra={
          <Button
            type="link"
            onClick={() => {
              setModalTitle("All Offboarding Resources");
              setModalRecords(filteredData);
              setIsModalOpen(true);
            }}
          >
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
            <Bar dataKey="value" fill="#f56c6c" name="Offboarding Count" cursor="pointer" />
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
          columns={
            modalRecords.length
              ? [
                  { title: "Candidate Name", dataIndex: "Candidate Name" },
                  { title: "Expected Offboarding Date", dataIndex: "Expected Offboarding Date" },
                  { title: "Client Space", dataIndex: "Client Space" },
                  { title: "Client Project", dataIndex: "Client Project" }
                ]
              : []
          }
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Modal>
    </>
  );
};

export default DemandToBeOffboarded;
