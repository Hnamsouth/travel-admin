import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { CreateTypeBus, EditTypeBus, DeleteBusData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { EditTypeBusTableCell } from "./EditTypeBusTableCell";
import { AddTypeBusFormModal } from "./AddTypeBusFormModal";
import { useLocation, useParams } from "react-router-dom";
import { BusSchedule, CreateTravelRoute, EditTravelRoute, Route, TravelRoute, getBusScheduleTableData, getRouteTableData, getTravelRouteTableData } from "@app/api/main/route.api";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DoW } from "../Schedule/Schedule";


const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};


const TravelRouteComponent = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bsId = parseInt(searchParams.get('bsId') as string);

  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<{ data: TravelRoute[]; pagination: Pagination; loading: boolean, routeList: Route[], busSchedule: BusSchedule[] }>({
    data: [],
    pagination: initialPagination,
    loading: false,
    routeList: [],
    busSchedule: []
  });
  const [editingKey, setEditingKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const { isMounted } = useMounted();


  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getTravelRouteTableData(pagination).then((res) => {
        getRouteTableData(initialPagination).then((res1) => {
          getBusScheduleTableData(initialPagination).then((res2) => {
            if (isMounted.current) {
              setTableData({ data: !Number.isNaN(bsId) ? res.data.filter(e => e.idBusSchedule === bsId) : res.data, pagination: res.pagination, loading: false, routeList: res1.data, busSchedule: res2.data });
            }
          })
        })
      });
    },
    [isMounted, bsId],
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

  const create = async (data: TravelRoute) => {
    console.log(data)
    const newTB = await CreateTravelRoute(data);
    if (newTB !== null) {
      let newData = [...tableData.data];
      newTB.idBusScheduleNavigation=tableData.busSchedule.find(e=>e.id===data.idBusSchedule) as BusSchedule;
      newTB.idRouteNavigation=tableData.routeList.find(e=>e.id===data.idRoute) as Route;
      newData.push(newTB);
      setTableData({ ...tableData, data: newData })
    }
    setVisible(false);
    console.log(newTB);

  }

  const save = async (key: React.Key) => {
    try {
      const newItem = (await form.validateFields());
      console.log(newItem)
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);
      const oldItem = newData[index];

      if (index > -1) {
        newItem['id'] = oldItem.id;
        newItem['idBusSchedule'] = oldItem.idBusSchedule;
        newItem['idSpecialSchedule'] = oldItem.idSpecialSchedule;
        const rs = await EditTravelRoute(newItem);
        if (rs) {
          if(newItem.idRoute!=oldItem.idRoute){
            newItem['idRouteNavigation'] =tableData.routeList.find(e=>e.id===newItem.idRoute);
          }
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

  const edit = (record: Partial<TravelRoute> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    form.setFieldValue('idRoute', record.idRoute);
    setEditingKey(record.id as number);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const handleDeleteRow = async (rowId: number) => {
    try {
      const rs = await DeleteBusData({ name: "type-bus", id: rowId });
      message.success("Delete success");
      setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowId) });
    } catch (error) {
      message.success("Delete failed");
    }
  };

  const isEditing = (record: TravelRoute) => record.id === editingKey;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
      key: "id"
    },
    {
      title: t('tables.travelRoute.timeStart'),
      dataIndex: 'timeStart',
      width: '15%',
      editable: true,
      key: "timeStart",

    },
    {
      title: t('tables.travelRoute.route'),
      dataIndex: 'idRoute',
      width: '20%',
      editable: true,
      key: "idRoute",
      render: (text: string, record: TravelRoute) => {
        const r = record.idRouteNavigation;

        return (<>
          {r?.idFromLocationNavigation?.name} <ArrowRightOutlined /> {r?.idToLocationNavigation?.name}
        </>);
      }
    },
    {
      title: t('tables.travelRoute.schedule'),
      dataIndex: 'idBusSchedule',
      width: '15%',
      // editable: true,
      key: "idBusSchedule",
      render: (text: string, record: TravelRoute) => <>
        {record.idBusScheduleNavigation?.idBusNavigation?.idTypeBusNavigation?.name}
        ({record.idBusScheduleNavigation?.idBusNavigation?.number}):
        {record.idBusSchedule} {DoW.find(e=>e.value===record.idBusScheduleNavigation?.dayOfWeek)?.title} </>
    },
    {
      title: t('tables.travelRoute.ss'),
      dataIndex: 'idSpecialSchedule',
      width: '15%',
      // editable: true,
      key: "idSpecialSchedule",
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      key: "actions",
      width: '20%',
      render: (text: string, record: TravelRoute) => {
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
      onCell: (record: TravelRoute) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        routes: tableData.routeList
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
          values['timeStart']= dayjs(values.timeStart).format("HH:mm:ss");
          // values['idSpecialSchedule']=0;
          create(values as TravelRoute);

        }}
      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
          {t('common.create')}
        </Button>
        <AddTypeBusFormModal visible={visible} onCancel={hideFormModal} routes={tableData.routeList} busSchedule={tableData.busSchedule} SpecialSchedule={[]} />
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
export default TravelRouteComponent;
