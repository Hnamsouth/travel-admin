import React from 'react';
import { InputNumber, Modal, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { Button } from '@app/components/common/buttons/Button/Button';
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined';
import { removeimg } from '@app/api/main/bus.api';
import { LocalUrl } from '@app/api/http.api';


interface AddTypeBusFormModal {
    visible: boolean;
    onCancel: () => void;
}

export const AddTypeBusFormModal: React.FC<AddTypeBusFormModal> = ({ visible, onCancel }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();

    const RemoveImg = (data: any) => {
        console.log(data.response)
        removeimg(data.response.public_id)
    }

    const uploadProps = {
        name: 'file',
        // multiple: true,
        action: LocalUrl+'type-bus/upload-img',// api post img
        onChange: (info: any) => {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info);
            }
            if (status === 'done') {
                message.success(t('uploads.successUpload', { name: info }));
            } else if (status === 'error') {
                message.error(t('uploads.failedUpload', { name: info.file.name }));
            }
        },
        onRemove: RemoveImg
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
                    label={t('tables.typeBus.name')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Input />
                </BaseForm.Item>
                <BaseForm.Item
                    name="pricePlus"
                    label={t('tables.typeBus.price')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <InputNumber />
                </BaseForm.Item>
                <BaseForm.Item
                    name="img"
                    label={t('tables.typeBus.img')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Upload {...uploadProps} openFileDialogOnClick>
                        <Button icon={<UploadOutlined />}>{t('uploads.clickToUpload')}</Button>
                    </Upload>
                </BaseForm.Item>
            </BaseForm>


        </Modal>
    );
};
