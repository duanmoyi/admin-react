import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Row, Select, Spin, Table} from "antd";
import {defaultSort, getColumnInputSearchProps, getImgUrl, tableChange} from "../../../utils/core";
import {connect} from "react-redux";

const columns = [{
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    ...getColumnInputSearchProps("昵称")
}, {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    ...getColumnInputSearchProps("手机号")
}, {
    title: '支付宝ID',
    dataIndex: 'alipayId',
    key: 'alipayId',
    ...getColumnInputSearchProps("支付宝编号")
}, {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
}, {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
}]

class UserInfoPage extends Component {
    state = {
        loading: false,
        searchData: {filter: [], sort: [defaultSort], page: this.props.page}
    }

    componentWillMount() {
        this.props.fetch(this.state.searchData)
    }

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key]) {
                continue
            }

            let operate = "eq"
            result.push({field: key, value: filters[key], type: operate})
        }
        return result
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background"
                     style={{
                         height: '90vh'
                     }}>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{padding: '50px 30px'}} bordered loading={this.state.loading}
                               columns={columns}
                               dataSource={this.props.data}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.userInfoConfig,
    initing: state.loading.effects.userInfoConfig.init,
    loading: state.loading.models.userInfoConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.userInfoConfig.init(data)
    },
})
export default connect(mapState, mapDispatch)(UserInfoPage);
