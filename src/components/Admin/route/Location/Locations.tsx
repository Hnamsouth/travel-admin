import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";
import { AddLocationFormModal } from "./AddLocationFormModal";
import { EditLocationTableCell } from "./EdiLocationTableCell";
import { CreateLocation, EditLocation, Location, getLocationTableData } from "@app/api/main/route.api";





const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};


interface ItableData {
  data: Location[];
  pagination: Pagination;
  loading: boolean
}

const Locations: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<ItableData>({
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
      getLocationTableData(pagination).then((res) => {
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
    console.log("show modal")
    setVisible(true);
  };

  const hideFormModal = () => {
    setVisible(false);
  };

  const create = async (data: Location) => {

    const rs = await CreateLocation(data);
    if (rs) {
      const updateData = [...tableData.data];
      updateData.push(rs);
      setTableData({ ...tableData, data: updateData })
      message.success("Create Success");
      setVisible(false);
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
        row['id'] = item.id;
        console.log(row)
        const rs = await EditLocation(row);
        if (rs) {
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableData({ ...tableData, data: newData });
          setEditingKey(0);

          message.success("Edit Success");
        }
      } else {
        message.warning("Not Found");
      }

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const edit = (record: Partial<Location> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    form.setFieldValue('area', record.area);
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const handleDeleteRow = (rowId: number) => {
    setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowId) });
  };

  const isEditing = (record: Location) => record.id === editingKey;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
    },
    {
      title: t('common.route.location.name'),
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: t('common.route.location.area'),
      dataIndex: 'area',
      width: '20%',
      editable: true,
    },
    {
      title: t('common.route.location.lat'),
      dataIndex: 'lat',
      width: '10%',
      editable: true,
    },
    {
      title: t('common.route.location.lng'),
      dataIndex: 'lng',
      width: '10%',
      editable: true,
    },
    {
      title: t('common.route.location.address'),
      dataIndex: 'addres',
      width: '20%',
      editable: true,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '20%',
      render: (text: string, record: Location) => {
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
      onCell: (record: Location) => ({
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
          values['id'] = 0;
          create(values as Location);
        }}

      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
          {t('common.create')}
        </Button>
        <AddLocationFormModal visible={visible} onCancel={hideFormModal} />
      </BaseButtonsForm.Provider>


      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditLocationTableCell,
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
export default Locations;
