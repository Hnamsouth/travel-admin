import React from 'react';
import { Col, Input, Modal, Row } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';



interface AddLocationFormModal {
    visible: boolean;
    onCancel: () => void;
}

export const AddLocationFormModal: React.FC<AddLocationFormModal> = ({ visible, onCancel }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();

    const areas = [
        {
            value: "City",
            title: t('common.route.location.city')
        },
        {
            value: "District",
            title: t('common.route.location.district')
        },
        {
            value: "Ward",
            title: t('common.route.location.ward')
        },
    ]

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
                <BaseForm.Item
                    name="name"
                    label={t('common.route.location.name')}
                    rules={[
                        { required: true, message: t('common.requiredField') }
                        , { validator: customValidator }]}
                >
                    <Input />
                </BaseForm.Item>

                <BaseForm.Item
                    name="area"
                    label={t('common.route.location.area')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={t('forms.validationFormLabels.selectCountry')}>
                        {areas.map((e, i) => <Option key={i} value={e.value}>{e.title}</Option>)}
                    </Select>
                </BaseForm.Item>
                <BaseForm.Item
                    name="addres"
                    label={t('common.route.location.address')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Input />
                </BaseForm.Item>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <BaseForm.Item
                            name="lat"
                            label={t('common.route.location.lat')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Input />
                        </BaseForm.Item>
                    </Col>
                    <Col span={12}>
                        <BaseForm.Item
                            name="lng"
                            label={t('common.route.location.lng')}
                            rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                            <Input />
                        </BaseForm.Item>
                    </Col>
                </Row>


            </BaseForm>
        </Modal>
    );
};
