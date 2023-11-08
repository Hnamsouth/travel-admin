import React, { useState } from 'react';
import { Col, InputNumber, Modal, Row, Select, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { BusSchedule, Route, SpecialSchedules } from '@app/api/main/route.api';
import { Buss } from '@app/api/main/bus.api';
import { Option } from '@app/components/common/selects/Select/Select';
import { ArrowRightOutlined } from '@ant-design/icons';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';



interface AddTypeBusFormModal {
    visible: boolean;
    onCancel: () => void;
    routes: Route[],
    busSchedule: BusSchedule[],
    SpecialSchedule: SpecialSchedules[],
    DoW: { value: number, title: string }[]

}

export const AddTypeBusFormModal: React.FC<AddTypeBusFormModal> = ({ visible, onCancel, routes, busSchedule, SpecialSchedule, DoW }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();
    const [bus,setBus]=useState<{disable:boolean,data:BusSchedule[]}>({disable:true,data:[]});

    useResetFormOnCloseModal({
        form,
        visible,
    });
    const handleDoWChange = (e: number) => {
        console.log(e)
        const busData = [...busSchedule];
        setBus({...bus,data:busData.filter(b=>b.dayOfWeek === e),disable:false});
    }

    const onOk = () => {
        form.submit();
    };

    return (
        <Modal title={t('tables.travelRoute.createTitle')} visible={visible} onOk={onOk} onCancel={onCancel}>
            <BaseForm form={form} layout="vertical" name="AddScheduleForm">
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <BaseForm.Item
                            name="timeStart"
                            label={t('tables.travelRoute.departureTime')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <DayjsDatePicker picker='time' />
                        </BaseForm.Item>
                    </Col>
                    <Col span={12}>
                        <BaseForm.Item
                            label={"DoW"}
                            name={"DoW"}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Select placeholder={"DoW"} onChange={(e) => handleDoWChange(e)}>
                                {DoW && DoW.map((e, i) => <Option key={i} value={e.value}>{e.title}</Option>)}
                            </Select>
                        </BaseForm.Item>
                    </Col>
                </Row>
                <BaseForm.Item
                    name="idRoute"
                    label={t('tables.travelRoute.route')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={"Choose Route"}>
                        {routes && routes.map((e, i) => <Option key={i} value={e.id}>{e.idFromLocationNavigation?.name}  <ArrowRightOutlined />{e.idToLocationNavigation?.name}    </Option>)}
                    </Select>
                </BaseForm.Item>
                <BaseForm.Item
                    name="idBusSchedule"
                    label={t('tables.busList.bus')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={"Choose Bus Schedule"} disabled={bus.disable}>
                        {bus.data && bus.data.map((e, i) => <Option key={i} value={e.id}>{e.idBusNavigation?.idTypeBusNavigation?.name}({e.idBusNavigation?.number}): {e.id}</Option>)}
                    </Select>
                </BaseForm.Item>
                {SpecialSchedule.length > 0 ? (<BaseForm.Item
                    name="idSpecialSchedule"
                    label={t('tables.typeBus.price')}
                >
                    <Select placeholder={"Choose Special Schedule"}>
                        {/* {SpecialSchedule && SpecialSchedule.map((e, i) => <Option key={i} value={e.id}>{e.idFromLocationNavigation?.name}  <ArrowRightOutlined />{e.idToLocationNavigation?.name}    </Option>)} */}
                    </Select>
                </BaseForm.Item>) : (<></>)}

            </BaseForm>


        </Modal>
    );
};
