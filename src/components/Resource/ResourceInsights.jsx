import  { useState } from "react";
import { Row, Col, Empty} from "antd";
import ResourceStatusChart from "../Insights/ResourceStatusChart";
import ResourcesByRole from "../Insights/ResourcesByRole";
import ResourceFilterTable from "../Insights/ResourceFilterTable" ;

function ResourceInsights({ localData = [] }) {

  const [selectedRole, setSelectedRole] = useState(null); 

  if (!localData.length) return <Empty description="No data available" style={{ marginTop: 64 }} />;

  const available = localData.filter(item => (item["Status"] || "").toLowerCase() === "available");
  const notavailable = localData.filter(item => (item["Status"] || "").toLowerCase() === "not available");
  const reserved = localData.filter(item => (item["Status"] || "").toLowerCase() === "reserved");
 
  return (
    <div style={{ padding: 24 }}>    
      <Row gutter={[16, 16]}>

        {/* ================== Widget: Resources by Status ================== */}
       <Col span={8}>
            <ResourceStatusChart
                available={available}
                notavailable={notavailable}
                reserved={reserved}
            />
        </Col>

        {/* ================== Widget: Resources by Role ================== */}
        <Col span={16}>
            < ResourcesByRole
                available={available}
                setSelectedRole={setSelectedRole}
            />
        </Col>

        {/* ================== Widget: Resources Filter Table Only ================== */}
       {/* Filters */}
        <Col span={24}>
         <ResourceFilterTable
            localData={available}
            externalRoleFilter={selectedRole} 
            />
        </Col>
      </Row>
    </div>
  );
}

export default ResourceInsights;
