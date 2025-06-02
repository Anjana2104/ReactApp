import { useEffect, useState } from "react";
import { message  } from "antd";
import { parseExcel } from "./excelUtils";
import { PRIMARY_KEYS , DERIVED_FIELDS, local_Storage_Key} from "../constants/fields";

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

  const onEdit = (updatedRecord) => {
    console.log("inside on edit - updatedRecord - ",updatedRecord)
    const updatedData = data.map((item) =>
    getRecordId(item) === getRecordId(updatedRecord) ? updatedRecord : item
    );
    setData(updatedData);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedData));

    console.log("inside on edit - updated data - ",updatedData)
    // propagateDerivedChanges(updatedData)
    setEditingKey(null); // ✅ End editing
    setEditingRecord({ ...updatedRecord});
    // setIsModalOpen(true);
    setMode("Edit");
    window.dispatchEvent(new Event("resource-data-updated"));
    message.success("Record updated");
  };
   
  
  // const propagateDerivedChanges = (updatedData) => {
  //   const derivedLinks = DERIVED_FIELDS[local_Storage_Key[sheetName]] || [];
  //   console.log("Propapgrate - dervied links", derivedLinks)
  //   derivedLinks.forEach(({ sourceField, targetobject, targetField }) => {
  //      const sourceValue = updatedData[sourceField];
      
  //      const targetKey = local_Storage_Key[Object.keys(local_Storage_Key).find(
  //           (k) => k.toLowerCase() === targetobject.toLowerCase()
  //           )
  //     ];

  //     if (!targetKey) return;
  //     const existingTargetData = JSON.parse(localStorage.getItem(targetKey) || "[]");
  //     const updatedTargetData = existingTargetData.map((item) => {
  //           return item[targetField] !== sourceValue
  //             ? { ...item, [targetField]: sourceValue }
  //             : item;
  //         });

  //         localStorage.setItem(targetKey, JSON.stringify(updatedTargetData));
  //         window.dispatchEvent(new Event(`${targetKey}-updated`));
  //       });
  //  }

  const handleSave = (key,field, value) => {
    const updated = { ...editingRecord, [field]: value };
    setEditingRecord(updated);
    handleModalOk(updated); 
    setEditingKey(null);   
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

const handleModalOk = () => {
      try {

        const id = getRecordId(editingRecord);
        // console.log("inside handleModalOk : id   -",id)

        const updated = data.some((d) => getRecordId(d) === id)
          ? data.map((d) => (getRecordId(d) === id ? editingRecord : d))
          : [...data, editingRecord];

        // console.log("inside handleModalOk : updated   -",updated)

        setData(updated);
        localStorage.setItem(localStorageKey, JSON.stringify(updated)); 

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
        console.log("inside handle upload - Primary key for sheet - ",sheetName ," is - ",primaryKey)

        const enriched = parsed.map((item, idx) => ({
          ...item,
          key: (item[primaryKey])
        }));

        console.log("inside handle upload - enriched data  - ",enriched)

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
    // EditableCell,
    handleUpload
  };
};