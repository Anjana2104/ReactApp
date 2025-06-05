import { Card, Tabs, Typography ,Button,Space } from "antd";
import ResourceDetails from "../components/Resource/ResourceDetails";
import ResourceInsights from "../components/Resource/ResourceInsights";
import {  HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {  useEffect ,useState } from "react";
import { local_Storage_Key} from "../constants/fields";
import { useGetData } from"../apis/dbCrudOperations"; 
import { END_POINTS} from "../constants/fields";

const { TabPane } = Tabs;

function AvailableResourceTabs() {
  const sheetName = "Resource Details"
  const navigate = useNavigate();
  const { Title } = Typography;
  const [localData, setLocalData] = useState([]);
  const { dbData, loading } = useGetData(END_POINTS[sheetName]);

   // ✅ Add this to sync localData when the app loads and when events happen
     useEffect(() => {
  const handleRefresh = () => {
    const stored = localStorage.getItem(local_Storage_Key[sheetName]);
    if (stored) {
      const parsed = JSON.parse(stored);
      setLocalData(parsed);
    }
  };

  // Initial load: DB or fallback to localStorage
  if (!loading) {
    if (dbData.length > 0) {
      setLocalData(dbData);
      localStorage.setItem(local_Storage_Key[sheetName], JSON.stringify(dbData));
    } else {
      const stored = localStorage.getItem(local_Storage_Key[sheetName]);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalData(parsed);
      }
    }
  }

  // Listen for update events from children
  window.addEventListener("resource-data-updated", handleRefresh);

  // Cleanup
  return () => {
    window.removeEventListener("resource-data-updated", handleRefresh);
  };
}, [dbData, loading]);



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
