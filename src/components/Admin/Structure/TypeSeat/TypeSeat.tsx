import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { TypeSeat, getTypeSeatTableData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { EditTypeSeatTableCell } from "./EditTypeSeatTableCell";
import { AddTypeSeatFormModal } from "./AddTypeSeatFormModal";


const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};


const TypeSeatComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<{ data: TypeSeat[]; pagination: Pagination; loading: boolean}>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [editingKey, setEditingKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const { isMounted } = useMounted();


  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getTypeSeatTableData(pagination).then((res) => {
        if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false });
          }
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

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields());
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const edit = (record: Partial<TypeSeat> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const handleDeleteRow = (rowid: number) => {
    setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowid) });
  };

  const isEditing = (record: TypeSeat) => record.id === editingKey;

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
    },
    {
      title: t('tables.typeSeat.name'),
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '20%',
      render: (text: string, record: TypeSeat) => {
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
                <Button type="default" disabled={editingKey !== 0} danger onClick={() => handleDeleteRow(record.id)}>
                  {t('tables.delete')}
                </Button>
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
      onCell: (record: TypeSeat) => ({
        record,
        inputType: col.dataIndex ,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  return (
    <>
      {/* create & edit modal */}
      <BaseButtonsForm.Provider
        onFormFinish={(name, { values, forms }) => {
          // call api post data.

        //   setTableData({...tableData,data:newData})
          setVisible(false);
        }}
      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
          {t('common.create')}
        </Button>
        <AddTypeSeatFormModal visible={visible} onCancel={hideFormModal}  />
      </BaseButtonsForm.Provider>


      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditTypeSeatTableCell,
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
export default TypeSeatComponent;
