import React from 'react';
import {useForm} from "antd/es/form/Form";
import {Button, Form, Input} from 'antd';

const {TextArea} = Input

const ActiveRuleConfigPage = props => {
    const [form] = useForm()

    const formItemLayout = {
        labelCol: {
            span: 3,
        },
        wrapperCol: {
            span: 12,
        },
    };

    return <div className="site-layout-background"
                style={{
                    paddingTop: "50px",
                    marginLeft: '15px',
                    marginRight: '15px',
                    marginTop: '15px',
                    height: '85vh'
                }}><Form
        {...formItemLayout}
        form={form}
    >
        <Form.Item name="ticketRule" label={"投票规则"}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item name="premiumRule" label={"中奖规则"}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item name="receiveRule" label={"领奖规则"}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item {...{
            wrapperCol: {
                offset: 3,
                span: 12,
            },
        }}>
            <Button type="primary" htmlType="submit">
                保存
            </Button>
            <Button style={{marginLeft:"10px"}} htmlType="button">
                重置
            </Button>
        </Form.Item>
    </Form>
    </div>
}

export default ActiveRuleConfigPage;
