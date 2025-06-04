import * as XLSX from "xlsx";
import dayjs from "dayjs";

export const exportToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Resources");
  XLSX.writeFile(wb, "updated_resources.xlsx");
};

export const parseExcel = (file, callback, sheetName, schema = []) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetToParse = sheetName && workbook.SheetNames.includes(sheetName)
        ? sheetName
        : workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetToParse];
      if (!worksheet) {
        alert(`Sheet "${sheetToParse}" not found.`);
        return;
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false,});
      const [rawHeaders, ...rows] = jsonData;
      if (!rawHeaders || rawHeaders.length === 0) {
        callback([]);
        return;
      }

      // Clean header names (trim, remove newlines)
      const headers = rawHeaders.map(h =>
        typeof h === "string" ? h.trim().replace(/\n/g, " ") : h
      );

      // Pre-map header types for quick lookup
      const typeMap = Object.fromEntries(
        schema.map(({ key, type }) => [key, type || "string"])
      );

      // Pre-compiled base date for date conversion
      const baseDate = new Date(1899, 11, 30);

      const parsedData = rows.map((row, index) => {
        const record = { "S.NO": index + 1 };

        headers.forEach((header, colIndex) => {
          const type = typeMap[header] || "string";
          let value = row[colIndex];

          switch (type) {
           case "date":
              if (typeof value === "number" && !isNaN(value) && value > 60) { 
                // Excel date serials start from 1900; 60 = ~1900-02-28
                value = new Date(1899, 11, 30 + value)
                  .toISOString()
                  .split("T")[0];
              } else if (typeof value === "string" && value.trim()) {
                const parsed = dayjs(value.trim());
                value = parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
              } else {
                value = "";
              }
              break;


            case "number":
              value = isNaN(value) ? "" : Number(value);
              break;

            case "boolean":
              value = String(value).toLowerCase() === "true";
              break;

            case "multiselect":
              value = typeof value === "string" ? value.trim() : "";
              break;

            default:
              value = value ?? "";
          }

          record[header] = value;
        });

        return record;
      });

      callback(parsedData);
    } catch (err) {
      console.error("Failed to parse Excel:", err);
      alert("An error occurred while parsing the Excel file.");
    }
  };

  reader.readAsArrayBuffer(file);
};


// ******************************OLD CODE ************************************************************
// export const parseExcelOLD = (file, callback, sheetName) => {
//   const reader = new FileReader();

//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: "array" });

//     const sheetToParse = sheetName && workbook.SheetNames.includes(sheetName)
//       ? sheetName
//       : workbook.SheetNames[0];

//     // console.log("Available sheets:", workbook.SheetNames);
//     // console.log("Requested sheet:", sheetToParse);

//     const worksheet = workbook.Sheets[sheetToParse];
//     if (!worksheet) {
//       alert(`Sheet "${sheetToParse}" not found in uploaded file.`);
//       return;
//     }

//     let parsedData;

//     if (sheetToParse === "Resource Details") {
//       // 🔧 Custom parsing for "Resource Details"
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
//       const headers = jsonData[0].slice(1).map(h => h?.toString().trim().replace(/\n/g, " "));

//       parsedData = jsonData.slice(1).map((row, index) => {
//         const record = Object.fromEntries(
//           headers.map((h, i) => {
//             let value = row[i + 1];

//             if (h === "DOJ" && typeof value === "number") {
//               const baseDate = new Date(1899, 11, 30);
//               value = new Date(baseDate.getTime() + value * 86400000)
//                 .toISOString()
//                 .split("T")[0];
//             }

//             return [h, value];
//           })
//         );

//         record["S.NO"] = index + 1;
//         return record;
//       });

//     } else {
//       // ✅ Clean generic parsing for other sheets
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
//       // console.log("jsonData:", jsonData);

//       const [headerRow, ...rows] = jsonData;
      
//       if (!headerRow || headerRow.length === 0) {
//         callback([]);
//         return;
//       }
      
//       parsedData = rows
//         .map((row) => {
//           const rowObj = {};
//           headerRow.forEach((header, i) => {
//             if (header && typeof header === "string") {
//               rowObj[header.trim()] = row[i] ?? "";
//             }
//           });
//           return rowObj;
//         })
//         .filter(row => Object.values(row).some(val => val !== "" && val != null)); // remove empty rows
//     }

//     // console.log("Parsed data from Excel:", parsedData);
//     callback(parsedData);
//   };

//   reader.readAsArrayBuffer(file);
// };