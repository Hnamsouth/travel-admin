import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, Col, Card, Row, Select, message, Tag } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { Buss, getBusesTableData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { v4 as uuidv4 } from 'uuid';
import { EditScheduleTableCell } from "./EditScheduleTableCell";
import { AddScheduleFormModal } from "./AddScheduleFormModal";
import { BusSchedule, EditBusSchedule, Route, getBusScheduleTableData, getRouteTableData } from "@app/api/main/route.api";
import dayjs from "dayjs";
import { ArrowRightOutlined } from '@ant-design/icons';
import { DayjsDatePicker } from "@app/components/common/pickers/DayjsDatePicker";
import { Priority } from "@app/constants/enums/priorities";
import { Status } from "@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status";
import { defineColorByPriority } from "@app/utils/utils";
import BusList from "../List/BusList";
import { Option } from "@app/components/common/selects/Select/Select";

const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};
interface ItableData {
  data: BusSchedule[];
  pagination: Pagination;
  loading: boolean,
  BusList: Buss[]
}

export const DoW = [
  { value: 1, title: "Monday" },
  { value: 2, title: "Tuesday" },
  { value: 3, title: "Wednesday" },
  { value: 4, title: "Thursday" },
  { value: 5, title: "Friday" },
  { value: 6, title: "Saturday" },
  { value: 0, title: "Sunday" },
]


const Schedule: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<ItableData>({
    data: [],
    pagination: initialPagination,
    loading: false,
    BusList: []
  });
  const dpk = <DayjsDatePicker />;
  const [editingKey, setEditingKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const Statuss = [ // pending:0 -- running:1 -- finished:2 -- cancel:3
    {
      id: 0, title: t('tables.busList.status.active')
    },
    {
      id: 1, title: t('tables.busList.status.stop')
    },
  ]

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getBusScheduleTableData(pagination).then((res) => {
        getBusesTableData(pagination).then((res2) => {
          if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false, BusList: res2.data });
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

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields());
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        row.status = parseInt(row.status);
        row['id'] = item.id;
        const rs = await EditBusSchedule(row);
        if (rs) {
          row['idBusNavigation'] = tableData.BusList.find(e => e.id === row.idBus)
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableData({ ...tableData, data: newData });
          message.success("Edit Success");
        } else {
          message.success("Edit Faild");
        }
      } else {
        message.success("Not Found");
      }
      setEditingKey(0);
    } catch (errInfo) {
      console.log(errInfo)
    }
  }

  const edit = (record: Partial<BusSchedule> & { id: React.Key }) => {
    form.setFieldsValue({ Name: '', ...record });
    form.setFieldValue('idBus', record.idBus);
    form.setFieldValue('status', record.status);
    form.setFieldValue('dayOfWeek', record.dayOfWeek);
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

  const isEditing = (record: BusSchedule) => record.id === editingKey;


  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
      sorter: (a: BusSchedule, b: BusSchedule) => a.id - b.id
    },
    {
      title: t('tables.busList.day'),
      dataIndex: 'dayOfWeek',
      width: '10%',
      editable: true,
      render: (text: string, record: BusSchedule) => DoW.find(e => e.value === record.dayOfWeek)?.title
    },
    {
      title: t('tables.busList.bus'),
      dataIndex: 'idBus',
      width: '10%',
      editable: true,
      render: (text: string, record: BusSchedule) => record.idBusNavigation?.idTypeBusNavigation?.name + `(${record.idBusNavigation?.number})`,
    },
    {
      title: t('tables.busList.status.title'),
      dataIndex: 'status',
      width: '10%',
      editable: true,
      render: (text: string, record: BusSchedule) => record.status === 0 ? <Status color={defineColorByPriority(Priority.LOW)} text={t('tables.busList.status.active')} /> :
        <Status color={defineColorByPriority(Priority.HIGH)} text={t('tables.busList.status.stop')} />
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '20%',
      render: (text: string, record: BusSchedule) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <>
                <Popconfirm title={t('tables.cancelInfo')} onConfirm={() => save(record.id)} >
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
                {record.travelRoutes.length > 0 ?
                  (
                    <Button type="primary" disabled={editingKey !== 0} onClick={() => handleDeleteRow(record.id)}>
                      {"Show Travel R"}
                    </Button>
                  ) :
                  (
                    <Button type="default" disabled={editingKey !== 0} onClick={() => handleDeleteRow(record.id)}>
                      {"Create Travel R"}
                    </Button>
                  )
                }
              </>
            )
            }
          </Space >
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
      onCell: (record: BusSchedule) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        Bus: tableData.BusList,
        Status: Statuss,
        DoW: DoW
      }),
    };
  });


  return (
    <>
      {/* create & edit modal */}
      <Card style={{ marginBottom: "15px" }}>
        <Row gutter={[20, 20]} justify="space-between">
          {/* create */}
          <Col span={12}>
            <BaseButtonsForm.Provider
              onFormFinish={(name, { values, forms }) => {
                // call api post data.
                setVisible(false);
              }}
            >
              <Button type="ghost" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
                {t('common.create')}
              </Button>
              <AddScheduleFormModal visible={visible} onCancel={hideFormModal} DoW={DoW} Bus={tableData.BusList} Status={Statuss} />
            </BaseButtonsForm.Provider>
          </Col>
          {/* filter */}
          <Col span={12}>
            <Row gutter={[20, 20]}>
              <Col span={8}>
                <Form.Item>
                  <Select placeholder={"Choose Bus"} onChange={() => console.log()}>
                    {tableData.BusList.map((e, i) => <Option key={i} value={e.id} >{e.idTypeBusNavigation?.name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Select placeholder={"DoW"} onChange={() => console.log()}>
                    {DoW.map((e, i) => <Option key={i} value={e.value} >{e.title}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Select placeholder={"Status"} onChange={() => console.log()}>
                    {Statuss.map((e, i) => <Option key={i} value={e.id} >{e.title}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>



      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditScheduleTableCell,
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
export default Schedule;
