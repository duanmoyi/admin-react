import React, {useEffect} from 'react';
import {useForm} from "antd/es/form/Form";
import {Button, Form, Input, Spin} from 'antd';
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
            <TextArea rows={6}/>
        </Form.Item>
        <Form.Item name="lotteryRule" label={"中奖规则"} rules={[{
            required: true,
            message: `请输入中奖规则！`,
        },]}>
            <TextArea rows={6}/>
        </Form.Item>
        <Form.Item name="exchangeRule" label={"领奖规则"} rules={[{
            required: true,
            message: `请输入领奖规则！`,
        },]}>
            <TextArea rows={6}/>
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
        const {initing, loading} = this.props;
        return <div className="site-layout-background"
                    style={{
                        paddingTop: "50px",
                    }}>

            <Spin tip={"正在加载。。。"} spinning={initing > 0 || loading > 0}>
                <ActiveRuleConfigForm data={this.props.data} submit={this.submit}/>
            </Spin>
        </div>
    }


}

const mapState = (state, ownProps) => ({
    data: state.activeRuleConfigModel.data,
    initing: state.loading.effects.activeRuleConfigModel.init,
    loading: state.loading.models.activeRuleConfigModel,
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
