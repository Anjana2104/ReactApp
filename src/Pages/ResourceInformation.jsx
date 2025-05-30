import { Card, Tabs, Typography ,Button,Space } from "antd";
import ResourceDetails from "../components/Resource/ResourceDetails";
import ResourceInsights from "../components/Resource/ResourceInsights";
import {  HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {  useEffect ,useState } from "react";

const { TabPane } = Tabs;

function AvailableResourceTabs() {
  const navigate = useNavigate();
  const { Title } = Typography;
  const [localData, setLocalData] = useState([]);

    // ✅ Add this to sync localData when the app loads and when events happen
  useEffect(() => {
        const fetchData = () => {
          const stored = localStorage.getItem("resource-data");
          if (stored) {
            setLocalData(JSON.parse(stored));
          }
        };

        fetchData(); // Initial load

        // Listen for global updates
        window.addEventListener("resource-data-updated", fetchData);

        // Cleanup listener
        return () => {
          window.removeEventListener("resource-data-updated", fetchData);
        };
      }, []);

    return (
        <Card style={{ margin: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button icon={<HomeOutlined />} onClick={() => navigate("/")} />
                <Title level={3} style={{ margin: 0 }}>Resource Information</Title>
            </div>

             <Button onClick={() => window.open("/planning", "planningTab")}>Go to Planning</Button>
            </div>

          <Space> 
             
         </Space>
            
        <Tabs defaultActiveKey="filters" type="card">
            <TabPane tab="All Resources " key="filters">
            <ResourceDetails localData={localData} />
            </TabPane>
            <TabPane tab="Resource Insights" key="insights">
            <ResourceInsights localData={localData} />
            </TabPane>
        </Tabs>
        </Card>
    );
    
}
export default AvailableResourceTabs;
