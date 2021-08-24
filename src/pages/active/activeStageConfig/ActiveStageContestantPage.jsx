import React, {Component, useEffect} from 'react';
import {Modal, Button, Col, Form, Input, Row, Select, Transfer, Switch, Table, Tag} from "antd";
import {connect} from "react-redux";
import {defaultPage, defaultSort, getImgUrl} from "../../../utils/core";
import difference from 'lodash/difference';

const {TextArea} = Input

const selectColumns = [{
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}]

const columns = [{
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
}, {
    title: '战队',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => record.status === "已淘汰" ? <Tag color={"#e3e0e2"}>{value}</Tag> :
        <Tag color={"#45e047"}>{value}</Tag>
},]

const TableTransfer = ({leftColumns, rightColumns, loading, ...restProps}) => (
    <Transfer {...restProps} showSelectAll={true}>
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
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
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
                onCancel={() => {
                    this.props.onCancel()
                    this.setState({targetKeys: []})
                }}
                onOk={this.onSubmit}
                width={"1500px"}>
                <TableTransfer
                    width={"1500px"}
                    loading={this.props.initing > 0}
                    dataSource={(this.props.data || []).map(m => {
                        m.key = m.id
                        return m
                    })}
                    titles={['参赛选手', '晋级选手']}
                    operations={['晋级', '撤回']}
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
    initing: state.loading.effects.contestantConfigModel.init,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async (data) => {
        await dispatch.contestantConfigModel.init({filter: [], sort: [defaultSort], page: defaultPage})
        await dispatch.teamConfigModel.init()
    },
})
export default connect(mapState, mapDispatch)(ActiveStageContestantPage);
