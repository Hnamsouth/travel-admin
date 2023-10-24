import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { useResetFormOnCloseModal } from '@app/components/forms/ControlForm/useResetFormOnCloseModal';
import { IcreateData } from './SeatStructure/SeatStructure';
import { Modal } from '@app/components/common/Modal/Modal';
import { Col, Row } from 'antd';
import { Button } from '@app/components/common/buttons/Button/Button';
import { ButtonType } from 'antd/lib/button';
import { SeatStructure, TypeSeat } from '@app/api/main/bus.api';


interface AddSeatStructureFormModal {
    visible: boolean;
    onCancel: () => void;
    setUpCreate: IcreateData
}
const seatArr = ["Normal","First Floor","Second Floor"];

export const AddSeatStructureFormModal: React.FC<AddSeatStructureFormModal> = ({ visible, onCancel, setUpCreate }) => {
    const [form] = BaseForm.useForm();
    const { t } = useTranslation();
    const setArray = (number: number) => {
        let data = [];
        for (let i = 0; i < number; i++) {
            data.push(i);
        }
        return data;
    }

    const row = setArray(setUpCreate.Bus_Structrue.row);
    const col = setArray(setUpCreate.Bus_Structrue.col);

    let letter = 'A';
    const [typeSeat, settypeseat] = useState("")
    const [isMouseEnter, setIsMouseEnter] = useState({ row: 0, col: 0, value: true }); // type all - none - col
    const [isMouseClick, setIsMouseClick] = useState({ row: 0, col: 0 })
    const [dataSelected, setDataSelected] = useState<SeatStructure[]>([])

    useResetFormOnCloseModal({
        form,
        visible,
    });
    const setTypeSeat = (type: string) => {
        if (type === "Reset") {
            setDataSelected([])
        }
        settypeseat(typeSeat === type || type === "Reset" ? "" : type)
    }

    const onMouseEnterSeat = (r: number, c: number) => {
        setIsMouseEnter({ ...isMouseEnter, row: r, col: c })
    }

    const onClickSeat = (r: number, c: number) => {
        // just save data when typeseat == space
        if (typeSeat === "Space") {
            // remove data if col exist 
            let newDataSelected = [...dataSelected];
            let filterData = newDataSelected.filter(e => e.rowIndex === c);
            let rowmax = filterData[filterData.length - 1];
            if (rowmax) {
                let index = newDataSelected.findIndex(e => e.colIndex === c);
                if (index > -1) {
                    newDataSelected.splice(index, filterData.length)
                }
            }
            let typeseat = setUpCreate.Typebus_Typeseat.find(e => e.idTypeSeatNavigation?.name === typeSeat);
            for (let i = 0; i <= r; i++) {
                newDataSelected.push({
                    rowIndex: i, colIndex: c, 
                    idTypeSeat: typeseat?.idTypeSeat as number,
                    idBusStructure: setUpCreate.Bus_Structrue.id,
                    id: 0,
                    idBusStructureNavigation: null,
                    idTypeSeatNavigation: null
                })
            }
            setDataSelected(newDataSelected)
            setIsMouseClick({ row: r, col: c })
        }
    }


    const onOk = () => {
        form.setFieldValue("data", dataSelected)
        form.submit();
    };

    return (
        <Modal title={t('forms.bus.newTypeSeat')} visible={visible} onOk={onOk} onCancel={onCancel} width={'100%'}>
            <BaseForm form={form} layout="vertical" name="seatStructureForm">
                <BaseForm.Item
                    name="data"
                    hidden
                >
                    <Input value={dataSelected.toString()} />
                </BaseForm.Item>
                <Row gutter={[30, 30]}>
                    {/* type seat */}
                    <Col xs={24} md={6}>
                        {
                            setUpCreate.Typebus_Typeseat.map((e, i) => {
                                return (
                                    <Button key={i} type={typeSeat === e.idTypeSeatNavigation?.name ? "primary" : "ghost"}
                                        disabled={seatArr.includes(e.idTypeSeatNavigation?.name as string)}
                                        onClick={() => setTypeSeat(e.idTypeSeatNavigation?.name as string)} style={{ "marginBottom": 10 + 'px' }}>
                                        {e.idTypeSeatNavigation?.name}
                                    </Button>
                                )
                            })
                        }
                        <Button type="default"
                            onClick={() => setTypeSeat("Reset")} style={{ "marginBottom": 10 + 'px' }}>
                            {t('newsFeed.reset')}
                        </Button>
                    </Col>
                    {/*  structure matrix */}
                    <Col className='ant-card-bordered' xs={24} md={18}>
                        {
                            row.map((r, i) => {
                                return (
                                    <Row key={i} gutter={[0, 8]} justify='center'>
                                        {
                                            col.map((c, j) => {
                                                let k = ((col.length * i) + j);
                                                let nameSeat = i > 0 ? (String.fromCharCode(letter.charCodeAt(0) + j) + (k < 10 ? "0" + k : k)) : (letter + (j < 10 ? "0" + j : j));
                                                let ri = isMouseEnter.row, ci = isMouseEnter.col;
                                                let c2 = ri >= i && ci === j ? "ghost" : "default" as ButtonType;
                                                let c3 = ri >= i && ci >= j ? "ghost" : "default" as ButtonType;
                                                let types = typeSeat === "" ? "default" : typeSeat === "Space" ? c2 : c3;
                                                types = dataSelected.length > 0 && dataSelected.filter(e => e.rowIndex >= i && e.colIndex === j).length > 0 ? "text" : types as ButtonType;
                                                return (
                                                    <Button key={(col.length * i) + j}
                                                        type={types}
                                                        onMouseEnter={() => onMouseEnterSeat(i, j)}
                                                        onClick={() => onClickSeat(i, j)}
                                                        style={{ "marginRight": 10 + 'px', "marginBottom": 10 + 'px' }}>
                                                        {nameSeat}
                                                    </Button>
                                                )
                                            })
                                        }
                                    </Row>

                                );
                            })
                        }

                    </Col>
                </Row>
            </BaseForm>
        </Modal>
    );
};
