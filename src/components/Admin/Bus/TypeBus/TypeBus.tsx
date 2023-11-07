import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { CreateTypeBus, EditTypeBus, TypeBusRequest, TypeBus, getTypeBusTableData, DeleteBusData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { EditTypeBusTableCell } from "./EditTypeBusTableCell";
import { AddTypeBusFormModal } from "./AddTypeBusFormModal";


const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};


const TypeBuss: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<{ data: TypeBus[]; pagination: Pagination; loading: boolean }>({
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
      getTypeBusTableData(pagination).then((res) => {
        if (isMounted.current) {
          console.log(res)
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
    setVisible(true);
  };

  const hideFormModal = () => {
    setVisible(false);
  };

  const create = async (data: TypeBusRequest) => {
    console.log(data)
    const newTB = await CreateTypeBus(data);
    if (newTB !== null) {
      let newData = [...tableData.data];
      newData.push(newTB);
      setTableData({ ...tableData, data: newData })
    }
    setVisible(false);
    console.log(newTB);

  }

  const save = async (key: React.Key) => {
    try {
      const newItem = (await form.validateFields());
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);
      const oldItem = newData[index];

      // if change img
      console.log(typeof newItem.img === 'string');
      if (typeof newItem.img === 'object' && newItem.img !== null) {
        newItem.img = newItem.img.file?.response.url;
        newItem['publicId'] = newItem.img.file?.response.public_id;
      } else {
        newItem['publicId'] = oldItem.publicId;
      }
      //  edit item founded
      if (index > -1) {
        newItem['id'] = oldItem.id;
        console.log(newItem)
        const rs = await EditTypeBus(newItem);
        if (rs) {
          newData.splice(index, 1, { ...oldItem, ...newItem, });
          message.success("Edit success");
        } else {
          message.error("Edit Faild");
        }
      } else {
        message.error("Edit not found");
      }
      setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const edit = (record: Partial<TypeBus> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    setEditingKey(record.id as number);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleDeleteRow =async (rowId: number) => {
    try {
      const rs = await DeleteBusData({name:"type-bus",id:rowId});
      message.success("Delete success");
      setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowId) });
    } catch (error) {
      message.success("Delete failed");
    }
  };
  
  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const isEditing = (record: TypeBus) => record.id === editingKey;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
      key: "id"
    },
    {
      title: t('tables.typeName'),
      dataIndex: 'name',
      width: '20%',
      editable: true,
      key: "name"
    },
    {
      title: t('tables.price'),
      dataIndex: 'pricePlus',
      width: '20%',
      editable: true,
      key: "pricePlus"
    },
    {
      title: t('tables.img'),
      dataIndex: 'img',
      width: '20%',
      editable: true,
      key: "img",
      render: (text: string, record: TypeBus) => {

        return (
          <img width={30} height={30} src={record.img as string} alt={""} />
        );
      }
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      key: "actions",
      width: '20%',
      render: (text: string, record: TypeBus) => {
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
      onCell: (record: TypeBus) => ({
        record,
        inputType: col.dataIndex,
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
          let data = { ...values } as TypeBusRequest;
          data['publicId'] = values.img.file?.response.public_id;
          data['img'] = values.img.file?.response.url;
          create(data);

        }}
      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
          {t('common.create')}
        </Button>
        <AddTypeBusFormModal visible={visible} onCancel={hideFormModal} />
      </BaseButtonsForm.Provider>


      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditTypeBusTableCell,
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
export default TypeBuss;
