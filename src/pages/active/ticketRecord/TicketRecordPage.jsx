import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Row, Select, Spin, Table, Tag} from "antd";
import {
    defaultSort,
    getColumnInputSearchProps,
    getColumnTimeRangeSearchProps,
    renderTime,
    tableChange
} from "../../../utils/core";
import {connect} from "react-redux";

const columns = [{
    title: '用户名',
    dataIndex: 'userNickName',
    key: 'userNickName',
    sorter: true,
    ...getColumnInputSearchProps("用户")
}, {
    title: '手机号',
    dataIndex: 'userPhoneName',
    key: 'userPhoneName',
    sorter: true,
    ...getColumnInputSearchProps("手机号")
}, {
    title: '选手',
    dataIndex: 'contestantName',
    key: 'contestantName',
    sorter: true,
    ...getColumnInputSearchProps("选手")

}, {
    title: '活动',
    dataIndex: 'stageName',
    key: 'stageName',
    sorter: true,
    ...getColumnInputSearchProps("活动")
}, {
    title: '投票时间',
    dataIndex: 'time',
    key: 'time',
    sorter: true,
    render: renderTime,
    ...getColumnTimeRangeSearchProps('投票时间')
}, {
    title: '票数',
    dataIndex: 'voteCount',
    key: 'voteCount',
    sorter: true,
}, {
    title: 'IP',
    dataIndex: 'userIp',
    key: 'userIp',
    ...getColumnInputSearchProps("IP")
}]

class TicketRecordPage extends Component {
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
            switch (key) {
                case "time":
                    operate = "timeRange"
            }
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
    ...state.ticketRecordConfig,
    initing: state.loading.effects.ticketRecordConfig.init,
    loading: state.loading.models.ticketRecordConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.ticketRecordConfig.init(data)
    },
})
export default connect(mapState, mapDispatch)(TicketRecordPage);
