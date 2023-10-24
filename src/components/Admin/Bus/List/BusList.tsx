import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BusCreate, Buss, CreateBus, DeleteBusData, EditBus, TypeBus, getBusesTableData, getTypeBusTableData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { EditBusListTableCell } from "./EditBusListTableCell";
import { AddBusListFormModal } from "./AddBusListFormModal";


const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};


interface ItableData {
  data: Buss[];
  pagination: Pagination;
  Type_Bus: TypeBus[];
  loading: boolean
}

const BusList: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<ItableData>({
    data: [],
    pagination: initialPagination,
    Type_Bus: [],
    loading: false,
  });
  const [editingKey, setEditingKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const { isMounted } = useMounted();


  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getBusesTableData(pagination).then((res) => {
        getTypeBusTableData(pagination).then((res1) => {
          if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, Type_Bus: res1.data, loading: false });
          }
        })
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const showFormModal = () => {
    console.log("show modal")
    setVisible(true);
  };

  const hideFormModal = () => {
    setVisible(false);
  };

  const create = async (data: BusCreate) => {

    const rs = await CreateBus(data);
    if (rs) {
      const newData = [...tableData.data];
      rs.idTypeBusNavigation = tableData.Type_Bus.find(e => e.id === rs.idTypeBus) as TypeBus;
      newData.push(rs);
      setTableData({ ...tableData, data: newData });
      setVisible(false);
      message.success("Create success");
    } else {
      message.error("Create Faild");
    }

  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields());
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        const tb = tableData.Type_Bus.find(e => e.id === row.idTypeBus);
        row['idTypeBus'] = tb?.id;
        row['id'] = item.id;
        // edit 
        const rs = await EditBus(row);
        if (rs) {
          row['idTypeBusNavigation'] = tb;
          newData.splice(index, 1, { ...item, ...row, });
          message.success("Edit success");
        } else {
          message.error("Edit faild");
        }
      } else {
        message.warn("NotFound");
      }
      setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const edit = (record: Partial<Buss> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    form.setFieldValue("idTypeBus", record.idTypeBusNavigation?.id)
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const handleDeleteRow = async (rowId: number) => {
    console.log(rowId)
    const rs = await DeleteBusData({ name: "bus-list", id: rowId });
    if (rs) {
      setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowId) });
      message.success("Delete success");
    } else {
      message.error("Delete failed");
    }
  };

  const isEditing = (record: Buss) => record.id === editingKey;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
    },
    {
      title: t('tables.busList.number'),
      dataIndex: 'number',
      width: '20%',
      editable: true,
      render: (text: string, record: Buss) => record.number < 10 ? "0" + record.number : record.number
    },
    {
      title: t('tables.status.title'),
      dataIndex: 'status',
      width: '20%',
      editable: true,
      render: (text: string, record: Buss) => {
        return (
          <span className={record.status ? "ant-tag-success" : "ant-tag-error"}>{record.status ? "Active" : "Stop"}</span>
        );
      }
    },
    {
      title: t('common.busType'),
      dataIndex: 'idTypeBus',
      width: '20%',
      editable: true,
      render: (text: string, record: Buss) => record.idTypeBusNavigation?.name
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '20%',
      render: (text: string, record: Buss) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <>
                <Popconfirm title={t('tables.cancelInfo')} onConfirm={() => save(record.id)}>
                  <Button type="primary"  >
                    {t('common.save')}
                  </Button>
                </Popconfirm>
                <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <Button type="ghost">{t('common.cancel')}</Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  {t('common.edit')}
                </Button>
                <Popconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record.id)}>
                  <Button type="default" disabled={editingKey !== 0} danger >
                    {t('tables.delete')}
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Buss) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        TypeBus: tableData.Type_Bus,
        status: record.status
      }),
    };
  });


  return (
    <>
      {/* create & edit modal */}
      <BaseButtonsForm.Provider
        onFormFinish={(name, { values, forms }) => {
          console.log(values)
          create(values as BusCreate);
        }}

      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
          {t('common.create')}
        </Button>
        <AddBusListFormModal visible={visible} onCancel={hideFormModal} TypeBus={tableData.Type_Bus} />
      </BaseButtonsForm.Provider>


      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditBusListTableCell,
            },
          }}
          bordered
          dataSource={tableData.data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            ...tableData.pagination,
            onChange: cancel,
          }}
          onChange={handleTableChange}
          loading={tableData.loading}
          scroll={{ x: 800 }}
        />
      </Form>
    </>
  )
}
export default BusList;
