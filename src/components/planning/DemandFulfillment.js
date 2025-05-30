import { Button, Card, Modal, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import GenericTable from "../GenericTable";
import GenericRecordModal from "../GenericRecordModal";
import { useCrudOperations } from "../../utils/crudoperations";
import { DEMAND_FULFILLMENT } from "../../constants/fields";

const DemandFulfillment = () => {
  const {
    data,
    editingRecord,
    isModalOpen,
    mode,
    deleteRecord,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleModalOk,
    handleFieldChange,
    addNewRecord,
    handleUpload,
    exportExcel,
    setIsModalOpen,
    setDeleteRecord,
  } = useCrudOperations({
    sheetName: "Demand Fullfillment",
    localStorageKey: "demand-fulfillment",
    getRecordId: (record) => record.key,
  });

  return (
    <div style={{ padding: 24 }}>
      <Card>

        <Space style={{ marginBottom: 16 }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewRecord}>Add New</Button>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>Download Excel</Button>
        </Space>

        <GenericTable data={data} onEdit={onEdit} onDelete={onDelete} />

        <GenericRecordModal
          open={isModalOpen}
          mode = {mode}
          record={editingRecord}
          fields={DEMAND_FULFILLMENT}
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
          Are you sure you want to delete this record?
        </Modal>
      </Card>
    </div>
  );
};

export default DemandFulfillment;


