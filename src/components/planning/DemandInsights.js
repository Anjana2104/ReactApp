import  { useState,useEffect } from "react";
import { Row, Col, Empty} from "antd";
import DemandBySpace from "../Insights/DemandBySpace";
import DemandToBeOffboarded from "../Insights/DemandToBeOffboarded";
import { local_Storage_Key} from "../../constants/fields";

function DemandInsights() {

 const parentSheetName = "Demand Fullfillment"
 const [localData, setLocalData] = useState([]);
 const [SelectedSpace, setSelectedSpace] = useState([]);


  // ✅ Add this to sync localData when the app loads and when events happen
useEffect(() => {
    const fetchData = () => {
      const stored = localStorage.getItem(local_Storage_Key[parentSheetName]);
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


  if (!localData.length) return <Empty description="No data available" style={{ marginTop: 64 }} />;
 
  return (
    <div style={{ padding: 24 }}>    
      <Row gutter={[16, 16]}>

        {/* ================== Widget: Demand By Space ================== */}
       <Col span={8}>
            <DemandBySpace
                data = {localData }
                setSelectedSpace={setSelectedSpace}
            />
        </Col>

        {/* ================== Widget: Demand To Be Offboarded ================== */}
        <Col span={16}>
            < DemandToBeOffboarded
                 data = {localData}
                 setSelectedSpace={setSelectedSpace}
            />
        </Col>

      </Row>
    </div>
  );
}

export default DemandInsights;
