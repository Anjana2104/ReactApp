import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { RESOURCE_KEYS ,local_Storage_Key, PRIMARY_KEYS} from "../../constants/fields";
import { exportToExcel } from "../../utils/excelUtils";
import { useRef } from "react";

function ResourceDetails({ localData }) {
    
  const sheetName = "Resource Details"

  const {
    editingRecord,
    isModalOpen,
    deleteRecord,
    mode,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleSave,
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
  });

   const handleExportFiltered = () => {
      exportToExcel(localData);
    };

  const tableRef = useRef();

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
        data={localData}
        sheetName={sheetName}
        onEdit={onEdit}
        onDelete={onDelete}
        tableRef={tableRef}
        editable={true}
        editingKey={editingKey}
        onDoubleClickEdit={(record) => setEditingKey(record.key)}
      />

      <GenericRecordModal
        mode={mode}
        open={isModalOpen}
        record={editingRecord}
        fields={RESOURCE_KEYS}
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
          Are you sure you want to delete {deleteRecord?.["Emp Name"]}?
        </Modal>
      </Card>
    </div>
  );
}

export default ResourceDetails;

