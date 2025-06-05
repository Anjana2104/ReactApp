import { Modal, Input, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

export default function RecordModal({ open, record, schema, onChange, onOk, onCancel, mode }) {
  const isEdit = mode != "Add";
  const modalTitle = isEdit ? "Edit Record" : "Add New Record";

 return (
    <Modal title={modalTitle} open={open} onOk={onOk} onCancel={onCancel} okText="Save">
      {record &&
        schema.map(({ key, type = "string", values = [] }) => {
          const commonProps = {
            style: { width: "100%" },
            // disabled: key === "S.NO",
          };

          const label = (
            <label key={key} style={{ marginBottom: 4, display: "block" }}>
              <b>{key}:</b>
            </label>
          );

          let input = null;

          switch (type) {
            case "date":
              input = (
                <DatePicker
                  {...commonProps}
                  value={record[key] ? dayjs(record[key]) : null}
                  onChange={(date, dateString) =>
                    onChange({ target: { value: dateString } }, key)
                  }
                />
              );
              break;

            case "number":
              input = (
                <InputNumber
                  {...commonProps}
                  value={record[key]}
                  onChange={(val) => onChange({ target: { value: val } }, key)}
                />
              );
              break;

            default:
              input = (
                <Input
                  {...commonProps}
                  value={record[key] || ""}
                  onChange={(e) => onChange(e, key)}
                />
              );
          }

          return (
            <div key={key} style={{ marginBottom: 12 }}>
              {label}
              {input}
            </div>
          );
        })}
    </Modal>
  );
}


