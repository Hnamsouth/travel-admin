import React from 'react';
import { InputNumber, Modal, Select, Upload, message } from 'antd';
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
    SpecialSchedule: SpecialSchedules[]

}

export const AddTypeBusFormModal: React.FC<AddTypeBusFormModal> = ({ visible, onCancel, routes, busSchedule, SpecialSchedule }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();


    useResetFormOnCloseModal({
        form,
        visible,
    });

    const onOk = () => {
        form.submit();
    };

    return (
        <Modal title={t('forms.bus.newTypeSeat')} visible={visible} onOk={onOk} onCancel={onCancel}>
            <BaseForm form={form} layout="vertical" name="typeSeatForm">
                <BaseForm.Item
                    name="timeStart"
                    label={t('tables.typeBus.name')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <DayjsDatePicker picker='time' />
                </BaseForm.Item>
                <BaseForm.Item
                    name="idRoute"
                    label={t('tables.typeBus.price')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={"Choose Route"}>
                        {routes && routes.map((e, i) => <Option key={i} value={e.id}>{e.idFromLocationNavigation?.name}  <ArrowRightOutlined />{e.idToLocationNavigation?.name}    </Option>)}
                    </Select>
                </BaseForm.Item>
                <BaseForm.Item
                    name="idBusSchedule"
                    label={t('tables.typeBus.price')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={"Choose Bus Schedule"}>
                        {busSchedule && busSchedule.map((e, i) => <Option key={i} value={e.id}>{e.idBusNavigation?.idTypeBusNavigation?.name}({e.idBusNavigation?.number}): {e.id}</Option>)}
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
