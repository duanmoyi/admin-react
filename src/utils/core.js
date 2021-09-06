import React, {useEffect, useState} from 'react';
import {Upload, Input, Space, Button, Select, message, DatePicker} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ImgCrop from 'antd-img-crop';
import moment from "moment";
import request from "../request/request";
import {Guid} from "js-guid";
import {navigate} from "@reach/router";

const {RangePicker} = DatePicker

export const RoleData = [{
    key: "ADMIN",
    roleName: "系统管理员"
}, {
    key: "VOTE_ADMIN",
    roleName: "星火力管理员"
}, {
    key: "REGISTER_ADMIN",
    roleName: "报名通道管理员"
}]

export const renderRole = (data) => {
    return data.map(m => {
        let match = RoleData.filter(n => n.key === m)
        if (match.length > 0) {
            return match[0].roleName
        }
    }).filter(m => m).join(",")
}

export const createRoutes = routeConfig => {
    if (routeConfig instanceof Array) {
        let routes = []
        routeConfig.forEach(m => {
            createRoutes(m).forEach(n => routes.push(n))
        })
        return routes
    }
    if (routeConfig.children) {
        routeConfig.children.forEach(m => {
            let path = m.path
            if (Array.isArray(routeConfig.path)) {
                m.path = routeConfig.path.map(n => n.concat(path))
            } else {
                m.path = routeConfig.path.concat(path)
            }
        })
    }

    return [routeConfig]
}

export const CommonImgUpload = ({uploadFunc, imgFile, maxCount = 1, ...otherProps}) => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setFileList(imgFile)
    }, [imgFile])

    const onChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
        uploadFunc(newFileList)
    };

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const isImageUrl = (file) => {
        return true;
    };


    return (
        <Upload
            {...otherProps}
            isImageUrl={isImageUrl}
            maxCount={maxCount}
            method="POST"
            action="upload-picture"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
        >
            {fileList.length < maxCount && '+ 点击上传'}
        </Upload>
    )
}

export const getImgUrl = (path) => {
    return "resource/" + path
}

export const loginUser = () => {
    let userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {}
    if (userInfo && userInfo.username) {
        return userInfo
    }
}

export const loginRedirect = async () => {
    const userInfo = loginUser()
    if (userInfo) {
        await navigate(userInfo.roles.filter(m => m === "ADMIN" || m === "VOTE_ADMIN").length > 0 ? "activeRuleConfig" : "registerInfo")
    }
}

export const getColumnInputSearchProps = (columnTitle) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
            <Input
                value={selectedKeys[0]}
                placeholder={`搜索 ${columnTitle}`}
                onChange={e => {
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }}
                onPressEnter={() => confirm({closeDropdown: false})}
                style={{marginBottom: 8, display: 'block'}}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => {
                        confirm({closeDropdown: true});
                    }}
                    icon={<SearchOutlined/>}
                    size="small"
                    style={{width: 90}}
                >
                    查询
                </Button>
                <Button onClick={() => {
                    clearFilters()
                }} size="small" style={{width: 90}}>
                    重置
                </Button>
            </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
})

export const getColumnSelectSearchProps = (columnTitle, selectData) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{}}>
            <Select placeholder={`搜索 ${columnTitle}`}
                    allowClear
                    value={selectedKeys}
                    onChange={e => {
                        setSelectedKeys(e)
                        confirm({closeDropdown: false});
                    }}
                    onPressEnter={() => confirm({closeDropdown: false})}
                    style={{display: 'block'}}>
                {(selectData || []).map(m => <Select.Option value={m.value}>{m.key}</Select.Option>)}
            </Select>
            <Space>
            </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
})

export const getColumnDateTimeSearchProps = (columnTitle) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{}}>

            <DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} allowClear placeholder={`搜索 ${columnTitle}`}
                        onChange={e => {
                            setSelectedKeys([e && e.format("YYYY-MM-DDTHH:mm:ss")])
                            confirm({closeDropdown: false});
                        }}
                        value={selectedKeys[0] && moment(selectedKeys[0], "YYYY-MM-DDTHH:mm:ss")}
                        onPressEnter={() => confirm({closeDropdown: false})}
                        style={{display: 'block'}}/>
            <Space>
            </Space>
        </div>
    ),
    filterIcon: filtered =>
        <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
    ,
})

export const getColumnTimeRangeSearchProps = () => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{}}>
            <div style={{"display": "block"}}>
                <RangePicker showTime format={"YYYY-MM-DD HH:mm:ss"} allowClear placeholder={["开始时间", "结束时间"]}
                             onChange={e => {
                                 setSelectedKeys(e && e.map(m => m.format("YYYY-MM-DDTHH:mm:ss")))
                                 confirm({closeDropdown: false});
                             }}
                             value={selectedKeys && selectedKeys.map(m => moment(m, "YYYY-MM-DDTHH:mm:ss"))}
                             onPressEnter={() => confirm({closeDropdown: false})}
                             style={{}}/>
            </div>
            <Space align={"end"}>
            </Space>
        </div>
    ),
    filterIcon: filtered =>
        <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
    ,
})


export const pageConvert = page => {
    return {
        current: page.number + 1,
        pageSize: page.size,
        total: page.totalElements
    }
}

export const tableChange = (pagination, filters, {field, order, columnKey}, {action}, component) => {
    if (action === "paginate") {
        let {searchData} = component.state
        searchData.page = pagination
        component.setState({searchData: searchData})
        component.props.fetch(searchData)
    }
    if (action === "filter") {
        let {searchData} = component.state
        searchData.filter = filters
        component.setState({searchData: searchData})
        component.props.fetch(searchData)
    }
    if (action === "sort") {
        let {searchData} = component.state
        let sort = []
        if (order) {
            switch (order) {
                case "ascend":
                    sort.push({field: field, order: "asc"})
                    break
                case "descend":
                    sort.push({field: field, order: "desc"})
            }
        }
        if (sort.length < 1) {
            sort = [component.defaultSort]
        }
        searchData.sort = sort
        searchData.currentPage = 1
        component.setState({searchData: searchData})
        component.props.fetch(searchData)
    }
}

export const getFilter = ({field, value, type}) => {
    if (!value) {
        return
    }
    if (Array.isArray(value) && value.length < 1) {
        return
    }
    switch (type) {
        case "eq":
            return field + "=" + value
        case "gt":
            return field + "Before=" + value
        case "lt":
            return field + "After=" + value
        case "timeRange":
            if (!value && Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
                return field + "Before=" + value[0] + "&" + field + "After=" + value[1]
            }
    }
}

export const defaultSort = {field: 'id', order: 'asc'}

export const defaultPage = {current: 1, pageSize: 10}

export const tableFetch = async (searchData, apiUrl, resultKey, defaultSortInfo = defaultSort) => {
    let {sort, filter, page} = searchData
    let {current, pageSize} = page
    current = Math.max(0, current - 1)
    if (!sort || sort.length < 1 || !sort[0]) {
        sort = [defaultSortInfo]
    }
    let filters = (filter || []).map(m => getFilter(m)).filter(m => m)
    let sorts = sort.filter(m => m).map(m => "sort=" + m.field + "," + m.order).reduce((m, n) => m + "&" + n)
    let result = await request("get", apiUrl + "?size=" + pageSize + "&page=" + (filters.length === 0 ? current : 0) + "&" + sorts + (filters.length > 0 ? "&" + filters.join("&") : ""), undefined)
    return {
        data: result && result._embedded && result._embedded[resultKey] || [],
        page: pageConvert(result && result.page || {
            "size": 10,
            "totalElements": 0,
            "totalPages": 0,
            "number": 0
        })
    }
}

export const renderTime = (time) => {
    if (!time || time === '') {
        return ''
    }

    return moment(time).format("YYYY-MM-DD HH:mm:ss")
}

export const imgUploadFunc = setImgFile => (fileList) => {
    if (fileList.length < 1) {
        setImgFile([])
        return
    }

    let file = fileList[0]
    if (file.status && file.status === "done") {
        if (file.response && !file.response.status === true) {
            message.error("图片上传失败，错误：" + file.response.message)
            return
        }
        setImgFile([file])
    }
}

export const setImg = (imgData, setImgFunc) => {
    if (imgData) {
        setImgFunc([{
            uid: Guid.newGuid().toString(),
            name: imgData,
            status: 'done',
            thumbUrl: getImgUrl(imgData),
            url: getImgUrl(imgData),
        }])
    }
}
