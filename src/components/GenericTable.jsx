import { Table, Button, Space, Popconfirm, Input } from "antd";
import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { NONEDITABLE_FIELDS } from "../constants/fields";

const GenericTable = forwardRef(({
  data,
  sheetName,
  onEdit,
  onDelete,
  editable = false,
  editingKey = null,
  onDoubleClickEdit = () => {},
  getColumns,
// }) => {
}, ref) => {
  const [filteredInfo, setFilteredInfo] = useState({});

  // useEffect(() => {
  //   if (tableRef) {
  //     tableRef.current = {
  //       clearFilters: () => {
  //         setFilteredInfo({});
  //       },
  //     };
  //   }
  // }, [tableRef]);

  useImperativeHandle(ref, () => ({
  clearFilters: () => setFilteredInfo({}),
   }));

  const getColumnSearchProps = (key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]).filter(Boolean))];
    return {
      filters: uniqueValues.map((value) => ({
        text: value,
        value: value,
      })),
      filterSearch: true,
      filteredValue: filteredInfo[key] || null,
      onFilter: (value, record) =>
        String(record[key] || "")
          .toLowerCase()
          .includes(String(value).toLowerCase()),
    };
  };

  const generateColumns = () => {
    if (!data || data.length === 0) return [];

    const baseColumns = Object.keys(data[0])
      .filter((key) => key !== "key")
      .map((key) => ({
        title: key,
        dataIndex: key,
        key,
        editable,
        ...getColumnSearchProps(key),
        onCell: (record) => ({
          record,
          dataIndex: key,
          editing: record.key === editingKey,
          onDoubleClick: () => onDoubleClickEdit(record),
        }),
      }));

    baseColumns.push({
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {/* {onEdit && <Button type="link" onClick={() => onEdit(record)}>Edit</Button>} */}
          {onDelete && (
            <Popconfirm title="Confirm delete?" onConfirm={() => onDelete(record)}>
              <Button danger type="link">Delete</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    });

    return baseColumns;
  };

  const defaultColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return getColumns ? getColumns(filteredInfo) : generateColumns();
  }, [data, filteredInfo, getColumns, editingKey]);

  const EditableCell = ({
    editing,
    dataIndex,
    record,
    children,
    onSave,
    onDoubleClick,
    sheetName,
    ...restProps
  }) => {

    const readOnlyFields = NONEDITABLE_FIELDS[sheetName] || [];
    const isReadOnly = readOnlyFields.includes(dataIndex);

    const [value, setValue] = useState(record?.[dataIndex] ?? "");

    const handleSave = () => {
      if (value !== record[dataIndex]) {
        onSave({ ...record, [dataIndex]: value });
      }
    };

    return (
       <td {...restProps} onDoubleClick={onDoubleClick}>
      {editing ? (
        isReadOnly ? (
          <Input value={value} disabled />
        ) : (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={handleSave}
          />
        )
      ) : (
        children
      )}
    </td>
  );
};

  const components = editable
    ? {
        body: {
          cell: (props) => (
            <EditableCell
              {...props}
              editing={props.record?.key === editingKey}
              onSave={onEdit}
              onDoubleClick={() => onDoubleClickEdit(props.record)}
              sheetName={sheetName}
            />
          ),
        },
      }
    : undefined;

  if (!data || data.length === 0) return null;

  const enhancedData = data.map((item, index) => ({
    key: item.key || item["Emp ID"] || String(index),
    ...item,
  }));

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters); // store applied filters
  };

  return (
    <Table
      rowKey="key"
      components={components}
      columns={defaultColumns}
      dataSource={enhancedData}
      pagination={{ pageSize: 5 }}
      size="small"
      scroll={{ x: true }}
      onChange={handleChange}
    />
  );
});

export default GenericTable;
