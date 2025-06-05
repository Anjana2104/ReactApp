import { useEffect, useState } from "react";
import axios from "axios";

// Base URL for API
const BASE_URL = "http://localhost:5000";

export const useDBCrudOperations = (endpoint) => {
  if (!endpoint) {
    throw new Error("❌ useDBCrudOperations requires an endpoint");
  }

  const fullApiUrl = `${BASE_URL}/api/${endpoint}`;
  const fullGetUrl = `${BASE_URL}/${endpoint}`;

  // GET
  const useGetData = () => {
    const [dbData, setDbData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios
        .get(fullGetUrl)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setDbData(res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch data:", err);
          setLoading(false);
        });
    }, []);

    return { dbData, loading };
  };

  // UPDATE
  const updateData = async (id, updatedRecord) => {
    console.log("🔄 Updating data:", id);
    await fetch(`${fullApiUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecord),
    });
  };

  // ADD
  const addData = async (newRecord) => {
    console.log("➕ Adding data:", newRecord);
    await fetch(fullApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    });
  };

  // DELETE
  const deleteData = async (id) => {
    console.log("❌ Deleting data:", id);
    await fetch(`${fullApiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return {
    useGetData,
    updateData,
    addData,
    deleteData,
  };
};
