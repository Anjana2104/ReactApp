import React from "react";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Resource Management Application</Title>

         <Button type="primary"  onClick={() => window.open("/resource-information", "resourceInfoTab")} style={{ marginRight: 12 }}>
          Resource Information
        </Button>
       
        
        <Button  onClick={() => window.open("/planning", "planningTab")}>Resource Planning</Button>
      </Card>
    </div>
  );
}

export default Home;
