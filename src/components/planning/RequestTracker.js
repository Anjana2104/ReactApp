// import { Button, Card, Modal, Space } from "antd";
// import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
// import GenericTable from "../GenericTable";
// import GenericRecordModal from "../GenericRecordModal";
// import { useCrudOperations } from "../../utils/crudoperations";
// import { REQUEST_TRACKER , PRIMARY_KEYS, local_Storage_Key } from "../../constants/fields";
// import { useRef } from "react";

// const RequestTracker = () => {
//   const sheetName = "Request Tracker"
//   const tableRef = useRef();

//   const {
//     data,
//     editingRecord,
//     isModalOpen,
//     editingKey,
//     setEditingKey,
//     mode,
//     deleteRecord,
//     onEdit,
//     onDelete,
//     handleConfirmDelete,
//     handleSave,
//     handleFieldChange,
//     addNewRecord,
//     handleUpload,
//     exportExcel,
//     setIsModalOpen,
//     setDeleteRecord,
//   } = useCrudOperations({
//     sheetName: sheetName,
//     localStorageKey: local_Storage_Key[sheetName],
//     getRecordId: (record) => String(record[PRIMARY_KEYS[sheetName] ]),
//   });

//   return (
//     <div style={{ padding: 24 }}>
//       <Card>

//         <Space style={{ marginBottom: 16 }}>
//           <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
//           <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>Add New</Button>
//           <Button icon={<DownloadOutlined />} onClick={exportExcel}>Download Excel</Button>
//         </Space>

//        <GenericTable
//         data={data}
//         sheetName={sheetName}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         tableRef={tableRef}
//         editable={true}
//         editingKey={editingKey}
//         onDoubleClickEdit={(record) => setEditingKey(record.key)}        
//         />

//        <GenericRecordModal
//           mode={mode}
//           open={isModalOpen}
//           record={editingRecord}
//           fields={REQUEST_TRACKER}
//           onChange={handleFieldChange}
//           onOk={handleSave}
//           onCancel={() => setIsModalOpen(false)}
//        />

//         <Modal
//           title="Confirm Delete"
//           open={!!deleteRecord}
//           onOk={handleConfirmDelete}
//           onCancel={() => setDeleteRecord(null)}
//         >
//           Are you sure you want to delete this record?
//         </Modal>
//       </Card>
//     </div>
//   );
// };

// export default RequestTracker;

import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { REQUEST_TRACKER_SCHEMA ,local_Storage_Key, PRIMARY_KEYS} from "../../constants/fields";
import { useRef } from "react";
import { exportToExcel } from "../../utils/excelUtils";

const RequestTracker = () => {
  const sheetName = "Request Tracker"
  const tableRef = useRef();
  const fields= REQUEST_TRACKER_SCHEMA.map(field => field.key);
  
  const {
    data,
    editingRecord,
    editingKey,
    setEditingKey,
    isModalOpen,
    mode,
    deleteRecord,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleSave,
    handleFieldChange,
    addNewRecord,
    handleUpload,
    setIsModalOpen,
    setDeleteRecord,
  } = useCrudOperations({
    sheetName: sheetName,
    localStorageKey: local_Storage_Key[sheetName],
    getRecordId: (record) => String(record[PRIMARY_KEYS[sheetName] ]),
  });

  const handleExportFiltered = () => {
      const filtered = tableRef.current?.getFilteredData?.();
      exportToExcel(filtered || data); // fallback to full data if filter is not available
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>

           {/* Left: Upload Input */}
            <div>
              <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
            </div>

            {/* Right: Buttons */}
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
          data={data}
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
            fields={fields}
            onChange={handleFieldChange}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
        />

        <Modal
          title="Confirm Delete"
          open={!!deleteRecord}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteRecord(null)}
        >
          Are you sure you want to delete this record?
        </Modal>
      </Card>
    </div>
  );
};

export default RequestTracker;



