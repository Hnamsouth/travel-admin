import React, { useState } from 'react';
import { InputNumber, Modal } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
import { TypeBus } from '@app/api/main/bus.api';


interface AddBusListFormModal {
    visible: boolean;
    onCancel: () => void;
    TypeBus:TypeBus[]
}

export const AddBusListFormModal: React.FC<AddBusListFormModal> = ({ visible, onCancel,TypeBus }) => {
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
                    name="number"
                    label={t('tables.busList.number')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <InputNumber />
                </BaseForm.Item>

                <BaseForm.Item
                    name="status"
                    label={t('tables.typeSeat.name')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <RadioGroup defaultValue={0}>
                        <RadioButton value={0} >{t('tables.status.stop')}</RadioButton>
                        <RadioButton value={1} >{t('tables.status.active')}</RadioButton>
                    </RadioGroup>
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
