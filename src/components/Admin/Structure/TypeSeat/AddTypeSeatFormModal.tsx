import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';


interface AddTypeSeatFormModal {
    visible: boolean;
    onCancel: () => void;
}

export const AddTypeSeatFormModal: React.FC<AddTypeSeatFormModal> = ({ visible, onCancel }) => {
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
                    name="name"
                    label={t('tables.typeSeat.name')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Input />
                </BaseForm.Item>
            </BaseForm>
        </Modal>
    );
};
