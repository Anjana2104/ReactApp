// src/pages/ResourcePlanning.js
import React from "react";
import { Card, Tabs , Button,Typography } from "antd";
import ClientSpaceDetails from "../components/planning/ClientSpaceDetails";
import ClientProjectDetails from "../components/planning/ClientProjectDetails";
import RequestDetails from "../components/planning/RequestDetails";
import RequestTracker from "../components/planning/RequestTracker";
import SOWDetails from "../components/planning/SOWDetails";
import DemandFulfillment from "../components/planning/DemandFulfillment";
import {  HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

function ResourcePlanning() {
  const navigate = useNavigate();
  const { Title } = Typography;

  return (
    
    <Card style={{ margin: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button icon={<HomeOutlined />} onClick={() => navigate("/")} />
                <Title level={3} style={{ margin: 0 }}>Resource Planning</Title>
            </div>

             <Button onClick={() => window.open("/resource-information", "resourceInfoTab")}>Go to Resource Information</Button>
      </div>


      <Tabs defaultActiveKey="1" type="line">
        <TabPane tab="Client Space Details" key="1">
          <ClientSpaceDetails />
        </TabPane>
        <TabPane tab="Client Project Details" key="2">
          <ClientProjectDetails />
        </TabPane>
        <TabPane tab="Request Details" key="3">
          <RequestDetails />
        </TabPane>
        <TabPane tab="Request Tracker" key="4">
           <RequestTracker />
        </TabPane>
        <TabPane tab="SOW Details" key="5">
           <SOWDetails />
        </TabPane>
        <TabPane tab="Demand Fulfillment" key="6">
           <DemandFulfillment />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ResourcePlanning;
