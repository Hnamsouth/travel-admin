import React from 'react';
import { Col, Modal, Radio, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { RadioGroup } from '@app/components/common/Radio/Radio';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Buss } from '@app/api/main/bus.api';



interface AddScheduleFormModal {
    visible: boolean;
    onCancel: () => void;
    Bus: Buss[],
    DoW: { value: number, title: string }[]
    Status: { id: number, title: string }[]
}

export const AddScheduleFormModal: React.FC<AddScheduleFormModal> = ({ visible, onCancel, Bus, DoW, Status }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();
    // useResetFormOnCloseModal({
    //     form,
    //     visible,
    // });

    const onOk = () => {
        form.submit();
    };


    return (
        <Modal title={t('tables.busList.createTitle')} visible={visible} onOk={onOk} onCancel={onCancel}>
            <BaseForm form={form} layout="vertical" name="typeSeatForm">
                <Row gutter={[20, 20]}>
                    <Col sm={24} xl={12}>
                        <BaseForm.Item
                            name="dayOfWeek"
                            label={t('tables.busList.day')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Select placeholder={t('tables.busList.day')}>
                                {DoW.map((e, i) => <Option key={i} value={e.value}>{e.title}</Option>)}
                            </Select>
                        </BaseForm.Item>
                    </Col>
                    <Col sm={24} xl={12}>
                        <BaseForm.Item
                            name="idBus"
                            label={t('tables.busList.bus')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Select placeholder={t('tables.busList.bus')}>
                                {Bus.map((e, i) => <Option key={i} value={e.id}>{e.idTypeBusNavigation?.name} ({e.number})</Option>)}
                            </Select>
                        </BaseForm.Item>
                    </Col>
                    <Col span={24}>
                        <BaseForm.Item
                            name="status"
                            label={t('tables.busList.status.title')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <RadioGroup>
                                {Status.map((e, i) => <Radio key={i} value={e.id}>{e.title}</Radio>)}
                            </RadioGroup>
                        </BaseForm.Item>
                    </Col>
                </Row>

            </BaseForm>
        </Modal>
    );
};
