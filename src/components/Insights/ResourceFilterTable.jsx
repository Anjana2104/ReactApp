import { useEffect, useState , useRef } from "react";
import {
  Card, Row, Col, Select, InputNumber, Table, Button} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useCrudOperations } from "../../utils/crudoperations";
import GenericTable from "../GenericTable";
import { PRIMARY_KEYS } from "../../constants/fields";
import { exportToExcel } from "../../utils/excelUtils";

const EXCLUDED_COLUMNS = ["S.NO", "Resume", "Emp ID", "Lead", "DOJ", "KL Exp (yr)"];

const ResourceFilterTable = ({localData, externalRoleFilter }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filters, setFilters] = useState({
    experienceMin: null,
    experienceMax: null,
    role: null,
  });
 
  const tableRef = useRef();
  const parentSheetName = "Resource Details"

  const {
    editingKey,
    setEditingKey,
    // EditableCell,
    onEdit,
    onDelete

  } = useCrudOperations({
    sheetName: parentSheetName,
    localStorageKey: "resource-data",
    getRecordId: (record) => String(record[PRIMARY_KEYS[parentSheetName]]),
  });


  // Extract filtered list of skills based on selected role
  const allSkills = [
    ...new Set(
      localData
        .filter(r => !filters.role || r["Role"] === filters.role)
        .flatMap((r) => {
          const primary = String(r["Primary skills"] || "").split(",");
          const secondary = String(r["Secondary skills"] || "").split(",");
          return [...primary, ...secondary].map((s) => s.trim());
        })
        .filter(Boolean)
    )
  ];

  // Apply external role filter from chart click
  useEffect(() => {
        // Set role from external filter
        if (externalRoleFilter) {
          setFilters(prev => ({ ...prev, role: externalRoleFilter }));
        }
      }, [externalRoleFilter]);

    const sourceData = localData;
    const filteredData = sourceData.filter((record) => {
        const skillsList = [
          ...String(record["Primary skills"] || "").split(","),
          ...String(record["Secondary skills"] || "").split(","),
        ].map((s) => s.trim().toLowerCase());

        const skillsMatch =
          selectedSkills.length === 0 ||
          selectedSkills.some(skill => skillsList.includes(skill.toLowerCase()));

        const exp = parseFloat(record["Total Workex (yr)"]);
        const expMatch =
          (!filters.experienceMin || (!isNaN(exp) && exp >= filters.experienceMin)) &&
          (!filters.experienceMax || (!isNaN(exp) && exp <= filters.experienceMax));

        const roleMatch = !filters.role || record["Role"] === filters.role;

        return skillsMatch && expMatch && roleMatch;
  });

  const availableRoles = Array.from(
    new Set(filteredData.map((r) => r["Role"]).filter(Boolean))
  ).sort();

 const handleExportFiltered = () => {
      exportToExcel(filteredData);
    };

  const getFilteredTableColumns = () => {
    if (!filteredData.length) return [];   
    return Object.keys(filteredData[0])
      .filter((key) => !EXCLUDED_COLUMNS.includes(key))
      .map((key) => ({
        title: key,
        editable: true, // ✅ this helps AntD recognize editable cells
        dataIndex: key,
        filters: [...new Set(filteredData.map(item => item[key]).filter(Boolean))].map(val => ({
          text: String(val),
          value: String(val),
        })),
        filterSearch: true,
        onFilter: (value, record) =>
          String(record[key] || "").toLowerCase().includes(String(value).toLowerCase()),
        onCell: (record) => ({
          record,
          dataIndex: key,
          editing: editingKey === record.key          
          
        }),
      }));

      
  };

  return (
   <Card
      title="Available Resources Filters"
      extra={
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => {
            setSelectedSkills([]);
            setFilters({
              experienceMin: null,
              experienceMax: null,
              role: null,
            });
          }}>
            Clear Filters
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportFiltered}>
            Export
          </Button>
        </div>
      }
    >

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select skills"
            value={selectedSkills}
            onChange={(value) => setSelectedSkills(value)}
            showSearch
            optionFilterProp="label"
            options={allSkills.map(skill => ({ label: skill, value: skill }))}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            placeholder="Min Exp (Total)"
            min={0}
            max={50}
            style={{ width: "100%" }}
            value={filters.experienceMin}
            onChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                experienceMin: val,
                experienceMax:
                  prev.experienceMax != null && val > prev.experienceMax
                    ? val
                    : prev.experienceMax,
              }))
            }
          />
        </Col>
        <Col span={4}>
          <InputNumber
            placeholder="Max Exp (Total)"
            min={filters.experienceMin || 0}
            max={50}
            style={{ width: "100%" }}
            value={filters.experienceMax}
            onChange={(val) => setFilters(prev => ({ ...prev, experienceMax: val }))}
          />
        </Col>
        <Col span={5}>
          <Select
            allowClear
            placeholder="Role"
            style={{ width: "100%" }}
            value={filters.role}
            onChange={(val) => setFilters(prev => ({ ...prev, role: val }))}
            showSearch
            optionFilterProp="label"
            options={availableRoles.map(role => ({ label: role, value: role }))}
          />
        </Col>
      </Row>

       <GenericTable
        data={filteredData}
        onEdit={onEdit}
        onDelete={onDelete}
        tableRef={tableRef}
        editable={true}
        editingKey={editingKey}
        onDoubleClickEdit={(record) => setEditingKey(record.key)}
        getColumns={getFilteredTableColumns}
      />

    </Card>
  );
};

export default ResourceFilterTable;

