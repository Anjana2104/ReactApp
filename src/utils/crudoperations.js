import { useEffect, useState } from "react";
import { message  } from "antd";
import { parseExcel } from "./excelUtils";
import { PRIMARY_KEYS , END_POINTS} from "../constants/fields";
import { useDBCrudOperations } from"../apis/dbCrudOperations"; 

export const useCrudOperations = ({
  sheetName,
  localStorageKey,
  getRecordId,
  schema 
}) => {
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [mode, setMode] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  
  const {  
    addData,
     updateData, 
     deleteData
     } = useDBCrudOperations(END_POINTS[sheetName]);


  //  ******************************************************************************************
  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, [localStorageKey]);

  //  ******************************************************************************************
 const handleFieldChange = (e, key) => {
    setEditingRecord((prev) => ({
      ...prev,
      [key]: e?.target?.value ?? "",  // avoids storing the full event object
    }));
};
  //  ******************************************************************************************
   const onEdit = async (updatedRecord) => {
    // console.log("onedit:syncing with DB:updatedRecord:id -",updatedRecord,getRecordId(updatedRecord))
    // Update Data in the Database 
    updateData( getRecordId(updatedRecord) , updatedRecord )
    const updatedData = data.map((item) =>
    getRecordId(item) === getRecordId(updatedRecord) ? updatedRecord : item
    );
    setData(updatedData);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
    // console.log("inside on edit - updated data - ",updatedData)
    setEditingKey(null); 
    // setEditingRecord({ ...updatedRecord});
    setIsModalOpen(false);
    setEditingKey(null);
    window.dispatchEvent(new Event("resource-data-updated"));
    message.success("Record updated");
    
  };

  //  ******************************************************************************************
   
const handleModalOk = () => {
    try {
      const id = getRecordId(editingRecord);
      console.log("inside handleModalOk : id   -",id)

      console.log("adding data in db  : updated   -",editingRecord)
      addData(editingRecord)

      const updated = data.some((d) => getRecordId(d) === id)
        ? data.map((d) => (getRecordId(d) === id ? editingRecord : d))
        : [...data, editingRecord];

      console.log("inside handleModalOk : updated   -",updated)
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


//  ******************************************************************************************
 const addNewRecord = () => {
  const newRecord = {
    ...(data[0] ? Object.fromEntries(Object.keys(data[0]).map(k => [k, ""])) : {})
  };
  console.log("New record before adding -",newRecord)
  setEditingRecord(newRecord);
  setMode("Add");
  setIsModalOpen(true);
};

//  ******************************************************************************************
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcel(file, (parsed) => {
        if (!Array.isArray(parsed) || parsed.length === 0) {
          message.error("Parsed data is empty or invalid.");
          return;
        }

        const primaryKey = PRIMARY_KEYS[sheetName] 
        // console.log("inside handle upload - Primary key for sheet - ",sheetName ," is - ",primaryKey)

        const enriched = parsed.map((item, idx) => ({
          ...item,
          key: (item[primaryKey])
        }));

        // console.log("inside handle upload - enriched data  - ",enriched)

        setData(enriched);
        localStorage.setItem(localStorageKey, JSON.stringify(enriched));
        message.success("Data saved to localStorage");
        window.dispatchEvent(new Event("resource-data-updated"));
      }, sheetName ,schema);
    }
  };

  //  ******************************************************************************************
  const onDelete = (record) => {
    setDeleteRecord(record);
    // setIsModalOpen(false); // hide Add/Edit modal if open
  };
//  ******************************************************************************************
  const handleConfirmDelete = () => {

    const updated = data.filter((item) => getRecordId(item) !== getRecordId(deleteRecord));
    setData(updated);
    //  Delete data from DB 
    deleteData(getRecordId(deleteRecord))
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setDeleteRecord(null);
    window.dispatchEvent(new Event("resource-data-updated"));
    message.success("Record deleted");
  };
  //  ******************************************************************************************


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
    handleFieldChange,
    addNewRecord,
    // EditableCell,
    handleUpload
  };
};
