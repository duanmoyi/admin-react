import React, {useEffect} from 'react';
import {useForm} from "antd/es/form/Form";
import {Button, Form, Input} from 'antd';
import {connect} from "react-redux";

const {TextArea} = Input

const ActiveRuleConfigForm = ({data, submit}) => {
    const [form] = useForm()

    useEffect(() => {
        form.setFieldsValue(data)
    })

    const formItemLayout = {
        labelCol: {
            span: 3,
        },
        wrapperCol: {
            span: 12,
        },
    };

    return <Form
        {...formItemLayout}
        form={form}>
        <Form.Item name="voteRule" label={"投票规则"} rules={[{
            required: true,
            message: `请输入投票规则！`,
        },]}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item name="lotteryRule" label={"抽奖规则"} rules={[{
            required: true,
            message: `请输入抽奖规则！`,
        },]}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item name="exchangeRule" label={"选票兑换规则"} rules={[{
            required: true,
            message: `请输入选票兑换规则！`,
        },]}>
            <TextArea rows={4}/>
        </Form.Item>
        <Form.Item {...{
            wrapperCol: {
                offset: 3,
                span: 12,
            },
        }}>
            <Button type="primary" htmlType="submit" onClick={() => {
                form.validateFields().then((values) => {
                    submit(values)
                }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
                保存
            </Button>
            <Button style={{marginLeft: "10px"}} htmlType="button" onClick={() => form.setFieldsValue(data)}>
                重置
            </Button>
        </Form.Item>
    </Form>
}

class ActiveRuleConfigPage extends React.Component {

    componentWillMount() {
        this.props.init()
    }

    submit = async (data) => {
        await this.props.update(data)
        this.props.init()
    }

    render() {
        return <div className="site-layout-background"
                    style={{
                        paddingTop: "50px",
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginTop: '15px',
                        height: '85vh'
                    }}>
            <ActiveRuleConfigForm data={this.props.data} submit={this.submit}/>
        </div>
    }


}

const mapState = (state, ownProps) => ({
    data: state.activeRuleConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async () => {
        await dispatch.activeRuleConfigModel.init()
    },
    update: async (data) => {
        await dispatch.activeRuleConfigModel.update(data)
    }
})
export default connect(mapState, mapDispatch)(ActiveRuleConfigPage);
