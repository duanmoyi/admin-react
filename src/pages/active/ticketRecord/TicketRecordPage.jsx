import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Row, Select, Table, Tag} from "antd";

const mockData = [{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
}, {
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},{
    username: "吴无物",
    telephone: "17325458652",
    activeName: "32晋16竞猜活动",
    time: "2021-08-11 15:21:32",
    ticketContestant: "肖杰",
    ipaddress:"10.1.1.1"
},]

const columns =  [{
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
}, {
    title: '用户手机号',
    dataIndex: 'telephone',
    key: 'telephone',
}, {
    title: '活动名称',
    dataIndex: 'activeName',
    key: 'activeName',
}, {
    title: '投票时间',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '用户IP',
    dataIndex: 'ipaddress',
    key: 'ipaddress',
}, {
    title: '投票选手',
    dataIndex: 'ticketContestant',
    key: 'ticketContestant',

}]

const SearchForm = ({searchFormData, searchFunc}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (searchFormData) {
            form.setFieldsValue(searchFormData)
        } else {
            form.resetFields()
        }
    })

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 19,
        },
    };

    return <Form form={form}{...formItemLayout} style={{marginTop: '10px'}}>
        <Row gutter={20}>
            <Col span={21}>
                <Row gutter={20} justify={"start"}>
                    <Col span={6}>
                        <Form.Item name="username" label={"用户名"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="telephone" label={"用户手机号"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="activeStage" label={"投票活动"}>
                            <Select>
                                <Select.Option value="virtual">32晋16竞猜活动</Select.Option>
                                <Select.Option value="actual">16晋8竞猜活动</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="ticketContestant" label={"选手姓名"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
            <Col span={3} style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                paddingBottom: '25px',
            }}>
                <Button type="primary" onClick={() => searchFunc(form.getFieldsValue())}>
                    查询
                </Button>
                <Button style={{margin: '0 8px'}} onClick={() => form.resetFields()}>
                    重置
                </Button>
            </Col>
        </Row>
    </Form>
}

class TicketRecordPage extends Component {
    state = {
        loading: false,
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background"
                     style={{
                         paddingTop: "10px",
                         marginLeft: '15px',
                         marginRight: '15px',
                         marginTop: '15px',
                         height: '85vh'
                     }}>
                    <div style={{marginRight: '5px', paddingTop: '5px'}}>
                        <SearchForm/>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           columns={columns}
                           dataSource={mockData}/>
                </div>
            </React.Fragment>
        );
    }
}

export default TicketRecordPage;
