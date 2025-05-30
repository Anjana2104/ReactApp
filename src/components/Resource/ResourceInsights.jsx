import  { useState } from "react";
import { Row, Col, Empty} from "antd";
import { exportToExcel } from "../../utils/excelUtils";
import ResourceStatusChart from "../Insights/ResourceStatusChart";
import ResourcesByRole from "../Insights/ResourcesByRole";
import ResourceFilterTable from "../Insights/ResourceFilterTable" ;

function ResourceInsights({ localData = [] }) {

  const [viewMode, setViewMode] = useState({ status: "chart", role: "chart" });
  const [selectedRole, setSelectedRole] = useState(null); 

  if (!localData.length) return <Empty description="No data available" style={{ marginTop: 64 }} />;

  const available = localData.filter(item => (item["Status"] || "").toLowerCase() === "available");
  const notavailable = localData.filter(item => (item["Status"] || "").toLowerCase() === "not available");
  const reserved = localData.filter(item => (item["Status"] || "").toLowerCase() === "reserved");
 
  const groupBy = (array, key) =>
    array.reduce((acc, curr) => {
      const val = curr[key] || "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const getTableColumns = () => {
    if (available.length === 0) return [];
    return Object.keys(available[0]).map(key => ({ title: key, dataIndex: key, key }));
  };

  const getChartData = field =>
    Object.entries(groupBy(available, field)).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: 24 }}>    
      <Row gutter={[16, 16]}>

        {/* ================== Widget: Resources by Status ================== */}
       <Col span={12}>
            <ResourceStatusChart
                available={available}
                notavailable={notavailable}
                reserved={reserved}
            />
        </Col>

        {/* ================== Widget: Resources by Role ================== */}
        <Col span={12}>
            < ResourcesByRole
                // available={available}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                // viewMode={viewMode}
                // setViewMode={setViewMode}
                // exportToExcel={exportToExcel}
                getChartData={getChartData}
                // getTableColumns={getTableColumns}
            />
        </Col>

        {/* ================== Widget: Resources Filter Table Only ================== */}
       {/* Filters */}
        <Col span={24}>
         <ResourceFilterTable
            localData={localData}
            externalRoleFilter={selectedRole} 
            />
        </Col>
      </Row>
    </div>
  );
}

export default ResourceInsights;
