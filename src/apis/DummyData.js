import { useEffect, useState } from "react";
import axios from "axios";

export const useDummyData = () => {
  const [dummyData, setDummyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/dummy")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDummyData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dummy data", err);
        setLoading(false);
      });
  }, []);

  return { dummyData, loading };
};
