import { useEffect, useState } from "react";
import { message , Input } from "antd";
import { parseExcel } from "./excelUtils";
import { PRIMARY_KEYS } from "../constants/fields";

export const useCrudOperations = ({
  sheetName,
  localStorageKey,
  getRecordId,
}) => {
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [mode, setMode] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, [localStorageKey]);

  const onEdit = (record) => {
    setEditingKey(record.key);
    setEditingRecord({ ...record });
    setIsModalOpen(true);
    setMode("Edit");
  };

  const EditableCell = ({
        editing,
        dataIndex,
        record,
        children,
        ...restProps
      }) => {
        return (
          <td {...restProps}>
            {editing ? (
              <Input
                defaultValue={record[dataIndex]}
                autoFocus
                onPressEnter={(e) =>
                  handleSave(record.key, dataIndex, e.target.value)
                }
              />
            ) : (
              children
            )}
          </td>
        );
    };

  const handleSave = (field, value) => {
    const updated = { ...editingRecord, [field]: value };
    setEditingRecord(updated);
    console.log("inside handle SAve - updated data till save function",updated)
    handleModalOk(updated); 
    setEditingKey(null);   // ✅ stop editing mode
    window.dispatchEvent(new Event("resource-data-updated"));
    message.success("Record updated");
  };

  const onDelete = (record) => {
    setDeleteRecord(record);
  };

  const handleConfirmDelete = () => {
    const updated = data.filter((item) => getRecordId(item) !== getRecordId(deleteRecord));
    setData(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setDeleteRecord(null);
    window.dispatchEvent(new Event("resource-data-updated"));
    message.success("Record deleted");
  };

const handleModalOk = (record) => {
      try {

        const id = getRecordId(record);
        console.log("inside handleModalOk : id   -",id)

        const updated = data.some((d) => getRecordId(d) === id)
          ? data.map((d) => (getRecordId(d) === id ? record : d))
          : [...data, record];

        console.log("inside handleModalOk : updated   -",updated)

        setData(updated);
        localStorage.setItem(localStorageKey, JSON.stringify(updated)); // ✅ cleaned is now serializable
        setEditingRecord(null);
        setIsModalOpen(false);
        setEditingKey(null);
        window.dispatchEvent(new Event("resource-data-updated"));
        message.success("Record saved");
      } catch (err) {
        console.error("Error saving record:", err);
        message.error("Failed to save record. Please check inputs.");
        setIsModalOpen(false);
      }
};

 const handleFieldChange = (e, key) => {
    setEditingRecord((prev) => ({
      ...prev,
      [key]: e?.target?.value ?? "",  // avoids storing the full event object
    }));
};


 const addNewRecord = () => {
  const newId = `${Date.now()}-${data.length}`;
  const newRecord = {
    ...(data[0] ? Object.fromEntries(Object.keys(data[0]).map(k => [k, ""])) : {}),
    "S.NO": data.length + 1,
    key: newId                   // ✅ must match what's used in getRecordId
  };

  // console.log("New record beofre adding -",newRecord)
  setEditingRecord(newRecord);
  setMode("Add");
  setIsModalOpen(true);
};

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcel(file, (parsed) => {
        if (!Array.isArray(parsed) || parsed.length === 0) {
          message.error("Parsed data is empty or invalid.");
          return;
        }

        const primaryKey = PRIMARY_KEYS[sheetName] 

        const enriched = parsed.map((item, idx) => ({
          ...item,
          key: item[primaryKey]
        }));
        setData(enriched);
        localStorage.setItem(localStorageKey, JSON.stringify(enriched));
        message.success("Data saved to localStorage");
        window.dispatchEvent(new Event("resource-data-updated"));
      }, sheetName);
    }
  };

  return {
    data,
    editingKey,
    setEditingKey,
    editingRecord,
    isModalOpen,
    deleteRecord,
    setIsModalOpen,
    setDeleteRecord,
    setEditingRecord,
    mode,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleModalOk,
    handleSave,
    handleFieldChange,
    addNewRecord,
    EditableCell,
    handleUpload
  };
};
