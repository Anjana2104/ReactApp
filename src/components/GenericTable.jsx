import React from "react";
import { Table, Button, Space, Popconfirm , Input} from "antd";

const GenericTable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) return null;

  const getColumnSearchProps = (key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]).filter(Boolean))];
    return {
      filters: uniqueValues.map((value) => ({
        text: value,
        value: value,
      })),
      filterSearch: true, // ✅ enables search input in dropdown
      onFilter: (value, record) =>
        String(record[key] || "")
          .toLowerCase()
          .includes(String(value).toLowerCase()),
    };
  };
  
  
  const generateColumnFilters = (key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]).filter(Boolean))];
    return uniqueValues.map((value) => ({
      text: String(value),
      value: String(value),
    }));
  };

  const columns = Object.keys(data[0])
    .filter((key) => key !== "key")
    .map((key) => ({
      title: key,
      dataIndex: key,
      ...getColumnSearchProps(key), // ✅ attach search-enabled filter
      filters: generateColumnFilters(key),
      onFilter: (value, record) =>
        record[key] !== undefined &&
        String(record[key]).toLowerCase().includes(String(value).toLowerCase()),
    }));

  const actionColumn = {
    title: "Actions",
    fixed: "right",
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
        <Popconfirm title="Confirm delete?" onConfirm={() => onDelete(record)}>
          <Button danger type="link">Delete</Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <Table
      columns={[...columns, actionColumn]}
      dataSource={data}
      rowKey="key"
      pagination={{ pageSize: 5 }}
      scroll={{ x: true }}
    />
  );
};

export default GenericTable;



