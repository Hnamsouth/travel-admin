import { Buss } from "@app/api/main/bus.api";
import { Select, Option } from "@app/components/common/selects/Select/Select";
import { Row, Col, Form } from "antd";
import React from "react";
import { TFunction } from "react-i18next";


interface IFilterWeekSchedule {
    BusList: Buss[],
    DoW: { value: number, title: string }[],
    Statuss: { id: number, title: string }[],
    t: TFunction<"translation", undefined>
}

const FilterWeekSchedule: React.FC<IFilterWeekSchedule> = React.memo(({ BusList, DoW, Statuss, t }) => {


    return (
        <Form name="filterWeekSchedule">
            <Row gutter={[20, 20]}>
                <Col span={8}>
                    <Form.Item>
                        <Select placeholder={t("common.bus.title")} onChange={() => console.log()}>
                            {BusList.map((e, i) => <Option key={i} value={e.id} >{e.idTypeBusNavigation?.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item>
                        <Select placeholder={"DoW"} onChange={() => console.log()}>
                            {DoW.map((e, i) => <Option key={i} value={e.value} >{e.title}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item>
                        <Select placeholder={t("tables.busList.status.title")} onChange={() => console.log()}>
                            {Statuss.map((e, i) => <Option key={i} value={e.id} >{e.title}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>

    )
});

export default FilterWeekSchedule;