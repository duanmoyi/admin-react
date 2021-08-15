import React, {Component, useEffect} from 'react';
import {Modal, Button, Col, Form, Input, Row, Select, Transfer, Switch, Table, Tag} from "antd";
import {connect} from "react-redux";
import {getImgUrl} from "../../../utils/core";
import difference from 'lodash/difference';

const {TextArea} = Input

const selectColumns = [{
    title: '选手头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '选手姓名',
    dataIndex: 'name',
    key: 'name',
}]

const columns = [{
    title: '选手头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '选手姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '选手性别',
    dataIndex: 'gender',
    key: 'gender',
}, {
    title: '所属战队',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '晋级状态',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => record.status === "已淘汰" ? <Tag color={"#e3e0e2"}>{value}</Tag> :
        <Tag color={"#45e047"}>{value}</Tag>
},]

const TableTransfer = ({leftColumns, rightColumns, ...restProps}) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
              direction,
              filteredItems,
              onItemSelectAll,
              onItemSelect,
              selectedKeys: listSelectedKeys,
              disabled: listDisabled,
          }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: item => ({disabled: listDisabled || item.disabled}),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({key}) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({key}, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{pointerEvents: listDisabled ? 'none' : null}}
                    onRow={({key, disabled: itemDisabled}) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);

const SearchForm = ({teamData, searchFormData, searchFunc}) => {
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
                        <Form.Item name="username" label={"选手姓名"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="teamId" label={"所属战队"}>
                            <Select>
                                {teamData.map(m => (
                                    <Select.Option value={m.id}>{m.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status" label={"晋级状态"}>
                            <Select>
                                <Select.Option value="已淘汰">已淘汰</Select.Option>
                                <Select.Option value="参赛中">参赛中</Select.Option>
                            </Select>
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

class ActiveStageContestantPage extends React.Component {
    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {editVisible: false},
        targetKeys: this.props.configResult || [],
    }

    componentWillMount() {
        this.props.init()
    }

    onChange = nextTargetKeys => {
        this.setState({targetKeys: nextTargetKeys});
    };

    onSubmit = () => {
        let keys = this.state.targetKeys
        this.props.submit(keys)
    }

    render() {
        return (
            <Modal
                maskClosable={false}
                visible={this.props.visible}
                title={"设定晋级人员"}
                okText="提交"
                cancelText="取消"
                onCancel={this.props.onCancel}
                onOk={this.onSubmit}
                width={"1000px"}>
                {/*<div className="site-layout-background"
                     style={{
                         paddingTop: "10px",
                         marginLeft: '15px',
                         marginRight: '15px',
                         marginTop: '15px',
                         height: '85vh'
                     }}>
                    <div style={{marginRight: '5px', paddingTop: '5px'}}>
                        <SearchForm teamData={this.props.teamData}/>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading} rowKey={"id"}
                           onRow={
                               record => ({
                                   onClick: event => {
                                       this.setState({selectRecord: record})
                                   },
                               })
                           }
                           columns={columns}
                           dataSource={this.props.data}/>
                </div>*/}
                <TableTransfer
                    dataSource={(this.props.data || []).map(m => {
                        m.key = m.id
                        return m
                    })}
                    titles={['参赛选手', '晋级选手']}
                    targetKeys={this.state.targetKeys}
                    showSearch
                    onChange={this.onChange}
                    filterOption={(inputValue, item) =>
                        item.name.indexOf(inputValue) !== -1
                    }
                    leftColumns={columns}
                    rightColumns={selectColumns}
                />
            </Modal>
        );
    }
}

const mapState = (state, ownProps) => ({
    data: state.contestantConfigModel.data,
    teamData: state.teamConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async (data) => {
        await dispatch.contestantConfigModel.init(data)
        await dispatch.teamConfigModel.init()
    },
})
export default connect(mapState, mapDispatch)(ActiveStageContestantPage);
