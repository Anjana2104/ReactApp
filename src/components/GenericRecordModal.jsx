import { Modal, Input } from "antd";

export default function RecordModal({ open, record, fields, onChange, onOk, onCancel, mode }) {
  const isEdit = mode != "Add";
  const modalTitle = isEdit ? "Edit Record" : "Add New Record";

  return (
    <Modal title={modalTitle} open={open} onOk={onOk} onCancel={onCancel} okText="Save">
      {record &&
        fields.map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label><b>{key}:</b></label>
            <Input
              type={key === "DOJ" ? "date" : "text"}
              value={
                key === "DOJ" && record[key]
                  ? new Date(record[key]).toISOString().split("T")[0]
                  : record[key] || ""
              }
              onChange={(e) => onChange(e, key)}
              disabled={key === "S.NO"} // ✅ Prevent editing auto-increment field
            />
          </div>
        ))}
    </Modal>
  );
}


