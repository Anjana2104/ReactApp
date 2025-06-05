import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { RESOURCE_KEYS_SCHEMA ,local_Storage_Key, PRIMARY_KEYS} from "../../constants/fields";
import { exportToExcel } from "../../utils/excelUtils";
import { useRef ,useEffect ,useState } from "react";
import { useDBCrudOperations } from"../../apis/dbCrudOperations"; 

function ResourceDetails({ localData }) {
    
  const sheetName = "Resource Details" 
  const [initialData, setInitialData] = useState([]);
  const { useGetData } = useDBCrudOperations("resources");
  const { dbData, loading } = useGetData();

 useEffect(() => {
  if (!loading) {
    if (dbData.length > 0) {
      setInitialData(dbData);
      // ✅ Save backend Data to localStorage
      localStorage.setItem(local_Storage_Key[sheetName], JSON.stringify(dbData));
    } else {
      // ✅ Fallback to localStorage if Db Data is empty
      const stored = localStorage.getItem(local_Storage_Key[sheetName]);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInitialData(parsed);
      }
    }
  }
}, [dbData, loading]);


  const {
    editingRecord,
    isModalOpen,
    deleteRecord,
    mode,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleModalOk,
    handleFieldChange,
    addNewRecord,
    handleUpload,
    setIsModalOpen,
    editingKey,
    setEditingKey,
    setDeleteRecord,
  } = useCrudOperations({
    sheetName: sheetName ,
    localStorageKey: local_Storage_Key[sheetName],
    getRecordId: (record) => String(record[PRIMARY_KEYS[sheetName] ]),
    schema : {RESOURCE_KEYS_SCHEMA},
    initialData 
  });

  const tableRef = useRef();

   const handleExportFiltered = () => {
      const filtered = tableRef.current?.getFilteredData?.();
      exportToExcel(filtered || localData); // fallback to full data if filter is not available
  };

  
  return (
<div style={{ padding: 24 }}>
  <Card>
    {/* Use flexbox to align file input left and buttons right */}
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      {/* You can hide or reposition this if needed */}
      <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />

      {/* Right-aligned buttons */}
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>
          Add New
        </Button>
        <Button onClick={() => tableRef.current?.clearFilters()}>
          Clear Filters
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExportFiltered}>
          Export
        </Button>
        
      </Space>
    </div>


    <GenericTable
        // data={initialData}
        data={localData}
        sheetName={sheetName}
        onEdit={onEdit}
        onDelete={onDelete}
        ref={tableRef}
        editable={true}
        editingKey={editingKey}
        onDoubleClickEdit={(record) => setEditingKey(record.key)}
      />

      <GenericRecordModal
        mode={mode}
        open={isModalOpen}
        record={editingRecord}
        schema={RESOURCE_KEYS_SCHEMA}
        onChange={handleFieldChange}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      />
        <Modal
          title="Confirm Delete"
          open={!!deleteRecord}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteRecord(null)}
        >
          Are you sure you want to delete {deleteRecord?.["Emp Name"]}?
        </Modal>
      </Card>
    </div>
  );
}

export default ResourceDetails;

