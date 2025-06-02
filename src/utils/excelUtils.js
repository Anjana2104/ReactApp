import * as XLSX from "xlsx";

export const parseExcel = (file, callback, sheetName) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetToParse = sheetName && workbook.SheetNames.includes(sheetName)
      ? sheetName
      : workbook.SheetNames[0];

    // console.log("Available sheets:", workbook.SheetNames);
    // console.log("Requested sheet:", sheetToParse);

    const worksheet = workbook.Sheets[sheetToParse];
    if (!worksheet) {
      alert(`Sheet "${sheetToParse}" not found in uploaded file.`);
      return;
    }

    let parsedData;

    if (sheetToParse === "Resource Details") {
      // 🔧 Custom parsing for "Resource Details"
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      const headers = jsonData[0].slice(1).map(h => h?.toString().trim().replace(/\n/g, " "));

      parsedData = jsonData.slice(1).map((row, index) => {
        const record = Object.fromEntries(
          headers.map((h, i) => {
            let value = row[i + 1];

            if (h === "DOJ" && typeof value === "number") {
              const baseDate = new Date(1899, 11, 30);
              value = new Date(baseDate.getTime() + value * 86400000)
                .toISOString()
                .split("T")[0];
            }

            return [h, value];
          })
        );


        record["S.NO"] = index + 1;
        return record;
      });

    }
    else if (sheetToParse === "Demand Fullfillment") {
      // 🔧 Custom parsing for "Resource Details"
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      const headers = jsonData[0].slice(1).map(h => h?.toString().trim().replace(/\n/g, " "));

      parsedData = jsonData.slice(1).map((row, index) => {
        const record = Object.fromEntries(
          headers.map((h, i) => {
            let value = row[i + 1];

            if (h === "Expected Offboarding Date" && typeof value === "number") {
              const baseDate = new Date(1899, 11, 30);
              value = new Date(baseDate.getTime() + value * 86400000)
                .toISOString()
                .split("T")[0];
            }

            return [h, value];
          })
        );


        record["S.NO"] = index + 1;
        return record;
      });

    }
    
    else {
      // ✅ Clean generic parsing for other sheets
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      // console.log("jsonData:", jsonData);

      const [headerRow, ...rows] = jsonData;
      
      if (!headerRow || headerRow.length === 0) {
        callback([]);
        return;
      }
      

      parsedData = rows
        .map((row) => {
          const rowObj = {};
          headerRow.forEach((header, i) => {
            if (header && typeof header === "string") {
              rowObj[header.trim()] = row[i] ?? "";
            }
          });
          return rowObj;
        })
        .filter(row => Object.values(row).some(val => val !== "" && val != null)); // remove empty rows
    }

    // console.log("Parsed data from Excel:", parsedData);
    callback(parsedData);
  };

  reader.readAsArrayBuffer(file);
};

export const exportToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Resources");
  XLSX.writeFile(wb, "updated_resources.xlsx");
};

