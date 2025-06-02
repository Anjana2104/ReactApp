import  { useState ,useEffect} from "react";
import { Row, Col, Empty} from "antd";
import DemandBySpaces from "../Insights/DemandBySpaces";
import DemandToBeOffboarded from "../Insights/DemandToBeOffboarded";
import { local_Storage_Key} from "../../constants/fields";

function DemandInsights() {

  const parentSheetName = "Demand Fullfillment"
  const [localData, setLocalData] = useState([]);
  const [SelectedSpace, setSelectedSpace] = useState([]);

   useEffect(() => {
    const storedData = localStorage.getItem(local_Storage_Key[parentSheetName]);
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
  }, []);

  if (!localData.length) return <Empty description="No data available" style={{ marginTop: 64 }} />;

  return (
    <div style={{ padding: 24 }}>    
      <Row gutter={[16, 16]}>

        {/* ================== Widget: Demand by SPACES ================== */}
       <Col span={8}>
            <DemandBySpaces
                data = {localData }
                setSelectedSpace={setSelectedSpace}
            />
        </Col>

        {/* ================== Widget: DEMAND TO BE OFFBOARDED ================== */}
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


