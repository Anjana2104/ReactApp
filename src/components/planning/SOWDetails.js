import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { SOW_DETAILS ,PRIMARY_KEYS, local_Storage_Key } from "../../constants/fields";
import { useRef } from "react";

const SOWDetails = () => {
  const sheetName = "SOW Details"
  const tableRef = useRef();

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
    exportExcel,
    setIsModalOpen,
    setDeleteRecord,
  } = useCrudOperations({
    sheetName: sheetName,
    localStorageKey: local_Storage_Key[sheetName],
    getRecordId: (record) => String(record[PRIMARY_KEYS[sheetName] ]),
  });

  return (
    <div style={{ padding: 24 }}>
      <Card>

        <Space style={{ marginBottom: 16 }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>Add New</Button>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>Download Excel</Button>
        </Space>

        <GenericTable
        data={data}
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
            fields={SOW_DETAILS}
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

export default SOWDetails;


