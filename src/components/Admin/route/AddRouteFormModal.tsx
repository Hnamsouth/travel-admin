import React from 'react';
import { Col, InputNumber, Modal, Row } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { Location } from '@app/api/main/route.api';



interface AddRouteFormModal {
    visible: boolean;
    onCancel: () => void;
    Location: Location[]
}

export const AddRouteFormModal: React.FC<AddRouteFormModal> = ({ visible, onCancel, Location }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();


    const customValidator = (_: any, value: string) => {
        // Thực hiện logic kiểm tra tùy chỉnh của bạn ở đây
        if (value && value.length < 5) {
            return Promise.reject('Tên phải có ít nhất 5 ký tự!');
        }
        return Promise.resolve();
    };

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
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <BaseForm.Item
                            name="idFromLocation"
                            label={t('common.route.from')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Select placeholder={t('common.route.from')}>
                                {Location.map((e, i) => <Option key={i} value={e.id}><strong>{e.name}</strong>:{e.addres}</Option>)}
                            </Select>
                        </BaseForm.Item>
                    </Col>
                    <Col span={12}>
                        <BaseForm.Item
                            name="idToLocation"
                            label={t('common.route.to')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Select placeholder={t('common.route.to')}>
                                {Location.map((e, i) => <Option key={i} value={e.id}><strong>{e.name}</strong>:{e.addres}</Option>)}
                            </Select>
                        </BaseForm.Item>
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={8}>
                        <BaseForm.Item
                            name="price"
                            label={t('common.route.price')}
                            rules={[
                                { required: true, message: t('common.requiredField') }]}
                        >
                            <InputNumber />
                        </BaseForm.Item>
                    </Col>
                    <Col span={8}>
                        <BaseForm.Item
                            name="distance"
                            label={t('common.route.distance')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <InputNumber />
                        </BaseForm.Item>
                    </Col>
                    <Col span={8}>
                        <BaseForm.Item
                            name="time"
                            label={t('common.route.time')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <InputNumber />
                        </BaseForm.Item>
                    </Col>
                </Row>
            </BaseForm>
        </Modal>
    );
};
