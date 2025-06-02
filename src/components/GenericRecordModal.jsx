import { Modal, Input } from "antd";

export default function RecordModal({ open, record, fields, onChange, onOk, onCancel, mode }) {
  const isEdit = mode != "Add";
  const modalTitle = isEdit ? "Edit Record" : "Add New Record";
  const dateFields = [ "Joining Date", "Expected Offboarding Date" , "Fullfillment Date","DOJ"];

  return (
    <Modal title={modalTitle} open={open} onOk={onOk} onCancel={onCancel} okText="Save">
      {record &&
        fields.map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label><b>{key}:</b></label>
            <Input
                  type={dateFields.includes(key) ? "date" : "text"}
                  value={
                          dateFields.includes(key) && record[key]
                            ? isNaN(new Date(record[key]))
                              ? ""
                              : new Date(record[key]).toISOString().split("T")[0]
                            : record[key] || ""
                        }

                  onChange={(e) => onChange(e, key)}
                  disabled={key === "S.NO"} // Prevent editing auto-increment field
              />
          </div>
        ))}
    </Modal>
  );
}


