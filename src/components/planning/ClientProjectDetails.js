// import { Button, Card, Modal, Space } from "antd";
// import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
// import GenericTable from "../GenericTable";
// import GenericRecordModal from "../GenericRecordModal";
// import { useCrudOperations } from "../../utils/crudoperations";
// import { PROJECT_DETAILS , PRIMARY_KEYS, local_Storage_Key } from "../../constants/fields";
// import { useRef } from "react";

// const ClientProjectDetails = () => {

//   const sheetName = "Project Details"
//   const tableRef = useRef();

//   const {
//     data,
//     editingRecord,
//     isModalOpen,
//     mode,
//     deleteRecord,
//     onEdit,
//     onDelete,
//     editingKey,
//     setEditingKey,
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

//         <GenericTable
//         sheetName={sheetName}
//         data={data}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         tableRef={tableRef}
//         editable={true}
//         editingKey={editingKey}
//         onDoubleClickEdit={(record) => setEditingKey(record.key)}        
//         />

//         <GenericRecordModal
//         mode={mode}
//         open={isModalOpen}
//         record={editingRecord}
//         fields={PROJECT_DETAILS}
//         onChange={handleFieldChange}
//         onOk={handleSave}
//         onCancel={() => setIsModalOpen(false)}
//       />

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

// export default ClientProjectDetails;

import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { PROJECT_DETAILS ,local_Storage_Key, PRIMARY_KEYS} from "../../constants/fields";
import { useRef } from "react";
import { exportToExcel } from "../../utils/excelUtils";

const ClientProjectDetails = () => {
  const sheetName = "Project Details"
  const tableRef = useRef();
  const fields= PROJECT_DETAILS
  
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

export default ClientProjectDetails;



