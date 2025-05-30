import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { RESOURCE_KEYS } from "../../constants/fields";

function ResourceDetails({ localData }) {
    
  const {
    editingRecord,
    isModalOpen,
    deleteRecord,
    mode,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleModalOk,
    handleSave,
    handleFieldChange,
    addNewRecord,
    handleUpload,
    exportExcel,
    setIsModalOpen,
    setDeleteRecord,
  } = useCrudOperations({
    sheetName: "Resource Details",
    localStorageKey: "resource-data",
    getRecordId: (record) => String(record["S.NO"]),
  });


  return (
    <div style={{ padding: 24 }}>
      <Card> 
        <Space style={{ marginBottom: 16 }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>Add New</Button>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>Download Excel</Button>
        </Space>

        <GenericTable data={localData} onEdit={onEdit} onDelete={onDelete} />
        
        <GenericRecordModal
          mode = {mode}
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

