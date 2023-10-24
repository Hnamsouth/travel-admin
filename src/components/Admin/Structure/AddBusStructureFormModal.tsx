import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { TypeBus } from '@app/api/main/bus.api';


interface AddBusStructureFormModal {
    visible: boolean;
    onCancel: () => void;
    TypeBus: TypeBus[]
}

export const AddBusStructureFormModal: React.FC<AddBusStructureFormModal> = ({ visible, onCancel, TypeBus }) => {
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
        <Modal title={t('forms.bus.newBusStructure')} visible={visible} onOk={onOk} onCancel={onCancel}>
            <BaseForm form={form} layout="vertical" name="busStructureForm">
                <BaseForm.Item
                    name="row"
                    label={t('tables.busStructure.row')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <InputNumber $block />
                </BaseForm.Item>
                <BaseForm.Item
                    name="col"
                    label={t('tables.busStructure.col')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <InputNumber $block />
                </BaseForm.Item>
                <BaseForm.Item
                    name="idTypeBus"
                    label={t('common.busType')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Select placeholder={t('forms.bus.lableSelectTypeBus')}>
                        {TypeBus.map((e) => {
                            return (
                                <Option key={e.id} value={e.id}>{e.name}</Option>
                            )
                        })}
                    </Select>
                </BaseForm.Item>
            </BaseForm>
        </Modal>
    );
};
