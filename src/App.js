import React, { useState , useEffect } from "react";
import { Button, Space, Card, Typography, message } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { parseExcel, exportToExcel } from "./utils/excelUtils";
import ResourceTable from "./components/ResourceTable";
import RecordModal from "./components/RecordModal";


const { Title } = Typography;

function App() {
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  const storedData = localStorage.getItem("resource-data");
  if (storedData) {
    setData(JSON.parse(storedData));
  }
}, []);


  const onEdit = (record) => {
    setEditingRecord({ ...record });
    setIsModalOpen(true);
  };

  const onDelete = (record) => {
    if (window.confirm(`Are you sure you want to delete ${record["Emp Name"]}?`)) {
      const snoToDelete = String(record["S.NO"]);
      const updatedData = data.filter(item => String(item["S.NO"]) !== snoToDelete);
      
      setData(updatedData);
      localStorage.setItem("resource-data", JSON.stringify(updatedData));
      // console.log("Saved to localStorage:");

      message.success("Record deleted");
    }
  };

  const handleModalOk = () => {
    const updatedList = data.some((d) => String(d["S.NO"]) === String(editingRecord["S.NO"]))
      ? data.map((d) => (String(d["S.NO"]) === String(editingRecord["S.NO"]) ? editingRecord : d))
      : [...data, editingRecord];

    setData(updatedList);

    localStorage.setItem("resource-data", JSON.stringify(updatedList));
    setEditingRecord(null);
    setIsModalOpen(false);
    
    message.success("Record saved.");

  };

  const handleFieldChange = (e, key) => {
    setEditingRecord((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const addNewRecord = () => {
    const newSNo = data.length > 0
      ? Math.max(...data.map((d) => parseInt(d["S.NO"], 10) || 0)) + 1
      : 1;

    setEditingRecord({ "S.NO": newSNo });
    setIsModalOpen(true);
  };


const handleUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    parseExcel(file, (parsedData) => {
      // console.log("Raw parsed data:", parsedData);

      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        message.error("Parsed data is empty or invalid. Check file format.");
        return;
      }

      setData(parsedData);

      localStorage.setItem("resource-data", JSON.stringify(parsedData));
      // console.log("LocalStorage after save");
      message.success("Data saved to localStorage");
    });
  }
};

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Resource Details</Title>
        <Space style={{ marginBottom: 16 }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>Add New</Button>
          <Button icon={<DownloadOutlined />} onClick={() => exportToExcel(data)}>Download Excel</Button>
        </Space>

        <ResourceTable data={data} onEdit={onEdit} onDelete={onDelete} />

        <RecordModal
          open={isModalOpen}
          record={editingRecord}
          onChange={handleFieldChange}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
        />
      </Card>
    </div>
  );
}

export default App;