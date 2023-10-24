// import React, { useState, useEffect, useCallback } from "react";
// import { Popconfirm, Form, TablePaginationConfig, Space, Col } from 'antd';
// import { Table } from 'components/common/Table/Table';
// import { Pagination } from 'api/table.api';
// import { Button } from 'components/common/buttons/Button/Button';
// import { useTranslation } from 'react-i18next';
// import { useMounted } from '@app/hooks/useMounted';
// import { Buss, getBusesTableData } from "@app/api/main/bus.api";
// import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";


// import { BusSchedule, Route, getBusScheduleTableData, getRouteTableData } from "@app/api/main/route.api";
// import dayjs from "dayjs";
// import { ArrowRightOutlined } from '@ant-design/icons';
// import { DayjsDatePicker } from "@app/components/common/pickers/DayjsDatePicker";
// import { Priority } from "@app/constants/enums/priorities";

// import { defineColorByPriority } from "@app/utils/utils";
// import { Status } from "@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status";

// const initialPagination: Pagination = {
//     current: 1,
//     pageSize: 20,
// };
// interface ItableData {
//     data: BusSchedule[];
//     pagination: Pagination;
//     loading: boolean,
//     routeList: Route[],
//     busList: Buss[]
// }


// const TicketDetail: React.FC = () => {
//     const [form] = Form.useForm();
//     const [tableData, setTableData] = useState<ItableData>({
//         data: [],
//         pagination: initialPagination,
//         loading: false,
//         routeList: [],
//         busList: []
//     });
//     const dpk = <DayjsDatePicker />;
//     const [editingKey, setEditingKey] = useState(0);
//     const [visible, setVisible] = useState(false);

//     const { t } = useTranslation();
//     const { isMounted } = useMounted();
//     const statuss = [ // pending:0 -- running:1 -- finished:2 -- cancel:3
//         {
//             id: 0, title: t('tables.busList.status.pending')
//         },
//         {
//             id: 1, title: t('tables.busList.status.running')
//         },
//         {
//             id: 2, title: t('tables.busList.status.finished')
//         },
//         {
//             id: 3, title: t('tables.busList.status.cancel')
//         },
//     ]

//     const fetch = useCallback(
//         (pagination: Pagination) => {
//             setTableData((tableData) => ({ ...tableData, loading: true }));
//             getBusScheduleTableData(pagination).then((res) => {
//                 getRouteTableData(pagination).then((res1) => {
//                     getBusesTableData(pagination).then((res2) => {
//                         if (isMounted.current) {
//                             setTableData({ data: res.data, pagination: res.pagination, loading: false, routeList: res1.data, busList: res2.data });
//                         }
//                     })
//                 })
//             });
//         },
//         [isMounted],
//     );

//     useEffect(() => {
//         fetch(initialPagination);
//     }, [fetch]);

//     const showFormModal = () => {
//         console.log("show modal")
//         setVisible(true);
//     };

//     const hideFormModal = () => {
//         setVisible(false);
//     };

//     const save = async (key: React.Key) => {
//         try {
//             const row = (await form.validateFields());
//             console.log(row)
//             const newData = [...tableData.data];
//             const index = newData.findIndex((item) => key === item.id);

//             if (index > -1) {
//                 const item = newData[index];
//                 row['route'] = tableData.routeList.find(e => e.id === row.route);
//                 row['bus'] = tableData.busList.find(e => e.id === row.bus);
//                 newData.splice(index, 1, {
//                     ...item,
//                     ...row,
//                 });
//                 console.log(row)
//             } else {
//                 newData.push(row);
//             }
//             setTableData({ ...tableData, data: newData });
//             setEditingKey(0);
//         } catch (errInfo) {
//             console.log('Validate Failed:', errInfo);
//         }
//     }

//     const edit = (record: Partial<BusSchedule> & { id: React.Key }) => {
//         form.setFieldsValue({ name: '', ...record });
//         form.setFieldValue('Date', record.date);
//         form.setFieldValue('Time', record.time);
//         form.setFieldValue('route', record.route?.id);
//         form.setFieldValue('bus', record.bus?.id);
//         form.setFieldValue('status', record.status);
//         setEditingKey(record.id);
//     };

//     const cancel = () => {
//         setEditingKey(0);
//     };

//     const handleTableChange = (pagination: TablePaginationConfig) => {
//         fetch(pagination);
//         cancel();
//     };

//     const handleDeleteRow = (rowid: number) => {
//         setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowid) });
//     };

//     const isEditing = (record: BusSchedule) => record.id === editingKey;


//     const columns = [
//         {
//             title: 'id',
//             dataIndex: 'id',
//             width: '5%',
//             editable: false,
//             sorter: (a: BusSchedule, b: BusSchedule) => a.id - b.id
//         },
//         {
//             title: t('tables.busList.date'),
//             dataIndex: 'Date',
//             width: '10%',
//             editable: true,
//         },
//         {
//             title: t('tables.busList.time'),
//             dataIndex: 'Time',
//             width: '10%',
//             editable: true,
//         },
//         {
//             title: t('tables.busList.route'),
//             dataIndex: 'route',
//             width: '20%',
//             editable: true,
//             render: (text: string, record: BusSchedule) => <> {record.from.name} <ArrowRightOutlined />  {record.route.to.name}</>
//         },
//         {
//             title: t('tables.busList.bus'),
//             dataIndex: 'bus',
//             width: '10%',
//             editable: true,
//             render: (text: string, record: BusSchedule) => record.bus.Type_Bus.name + `(${record.bus.Number})`,
//         },
//         {
//             title: t('tables.busList.status.title'),
//             dataIndex: 'status',
//             width: '10%',
//             editable: true,
//             render: (text: string, record: BusSchedule) => {
//                 //pending:0 -- running:1 -- finished:2 -- cancel:3
//                 let check = record.status === 0 ? Priority.INFO : record.status === 1 ? Priority.MEDIUM : record.status === 2 ? Priority.LOW : Priority.HIGH;
//                 return (
//                     <Col key={"tag" + record.id}>
//                         <Status color={defineColorByPriority(check)} text={statuss.find(e => e.id === record.status)?.title.toUpperCase() as string} />
//                     </Col>
//                 )
//             }
//         },
//         {
//             title: t('tables.busList.delay'),
//             dataIndex: 'Delay',
//             width: '10%',
//             editable: true,
//         },
//         {
//             title: t('tables.actions'),
//             dataIndex: 'actions',
//             width: '20%',
//             render: (text: string, record: BusSchedule) => {
//                 const editable = isEditing(record);
//                 return (
//                     <Space>
//                         {editable ? (
//                             <>
//                                 <Popconfirm title={t('tables.cancelInfo')} onConfirm={() => save(record.id)} >
//                                     <Button type="primary"  >
//                                         {t('common.save')}
//                                     </Button>
//                                 </Popconfirm>
//                                 <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
//                                     <Button type="ghost">{t('common.cancel')}</Button>
//                                 </Popconfirm>
//                             </>
//                         ) : (
//                             <>
//                                 <Button type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
//                                     {t('common.edit')}
//                                 </Button>
//                                 <Button type="default" disabled={editingKey !== 0} danger onClick={() => handleDeleteRow(record.id)}>
//                                     {t('tables.delete')}
//                                 </Button>
//                             </>
//                         )}
//                     </Space>
//                 );
//             },
//         },
//     ];

//     const mergedColumns = columns.map((col) => {
//         if (!col.editable) {
//             return col;
//         }

//         return {
//             ...col,
//             onCell: (record: BusSchedule) => ({
//                 record,
//                 inputType: col.dataIndex,
//                 dataIndex: col.dataIndex,
//                 title: col.title,
//                 editing: isEditing(record),
//                 route: tableData.routeList,
//                 bus: tableData.busList,
//                 status: statuss,
//             }),
//         };
//     });


//     return (
//         <>
//             {/* create & edit modal */}
//             <BaseButtonsForm.Provider
//                 onFormFinish={(name, { values, forms }) => {
//                     // call api post data.
//                     let newData = { ...values } as BusSchedule;
//                     const updateData = [...tableData.data];
//                     newData['date'] = dayjs(values.Date).format('DD/MM/YYYY');
//                     newData['time'] = dayjs(values.Time).format('hh:mm');

//                     newData['route'] = tableData.routeList.find(e => e.id === values.route) as Route;
//                     newData['bus'] = tableData.busList.find(e => e.id === values.bus) as Buss;
//                     newData['id'] = Math.floor(Math.random() * 100) + 5;

//                     updateData.push(newData);
//                     setTableData({ ...tableData, data: updateData })
//                     setVisible(false);
//                 }}
//             >
//                 <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
//                     {t('common.create')}
//                 </Button>
//                 {/* <AddScheduleFormModal visible={visible} onCancel={hideFormModal} route={tableData.routeList} bus={tableData.busList} status={statuss} /> */}
//             </BaseButtonsForm.Provider>


//             {/* list &  delete in table */}
//             <Form form={form} component={false}>
//                 <Table
//                     bordered
//                     dataSource={tableData.data}
//                     columns={mergedColumns}
//                     rowClassName="editable-row"
//                     pagination={{
//                         ...tableData.pagination,
//                         onChange: cancel,
//                     }}
//                     onChange={handleTableChange}
//                     loading={tableData.loading}
//                     scroll={{ x: 800 }}
//                 />
//             </Form>
//         </>
//     )
// }
// export default TicketDetail;
