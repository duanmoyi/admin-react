import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Row, Select, Table} from "antd";

const mockData = [{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
},{
    username:"┻┳|･ω･)问我？",
    telephone:"13584521458",
    openId:"265asd2das22fdee555",
    city:"浙江省杭州市"
}]

const columns =  [{
    title: '用户头像',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '用户昵称',
    dataIndex: 'username',
    key: 'username',
}, {
    title: '用户手机号',
    dataIndex: 'telephone',
    key: 'telephone',
}, {
    title: '支付宝用户编号',
    dataIndex: 'openId',
    key: 'openId',
}, {
    title: '所在城市',
    dataIndex: 'city',
    key: 'city',
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

class UserInfoPage extends Component {
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

export default UserInfoPage;
