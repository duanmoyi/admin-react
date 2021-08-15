import React, {useEffect, useState} from 'react';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';

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

export const CommonImgUpload = ({uploadFunc, imgFile, maxCount = 1}) => {
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
            isImageUrl={isImageUrl}
            maxCount={maxCount}
            method="POST"
            action="/upload-picture"
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
    return "/resource/" + path

}
