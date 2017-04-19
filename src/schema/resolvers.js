/**
 * Created by zhubg on 2017/4/17.
 */

'use strict';

//数据库dao
// import {baseDao} from '../dao/baseDao';

//objects
import {Token,Message,DeviceList} from './objects';

export const resolvers = {
    Query: {
        getToken() {
            let token = require('crypto').randomBytes(10).toString('hex');
            let message = new Message();
            message.type = "info";
            message.code = "00001";
            message.content = "this is a message test";
            console.log("token_test");
            console.log(token);
            return new Token(token);
            // return message;
        },
        getDeviceListResult(){
            let message = new Message();
            message.type = "info";
            message.code = "00001";
            message.content = "this is a message test";

            let sofeware_list = [
                {
                    version: "1.0",
                    title: "报表系统"
                }
            ];

            let monitors = [
                {
                    error_limited: "0-0",
                    monitor_status: "normal",
                    update_time: "2017-04-14 10:40:35",
                    title: "检测硬盘",
                    monitor_class: "disk",
                    monitor_value: "100",
                    alert_limited: "0-0"
                },
                {
                    error_limited: "213-321",
                    monitor_status: "alert",
                    update_time: "2017-04-14 10:40:35",
                    title: "检测内存",
                    monitor_class: "mem",
                    monitor_value: "80",
                    alert_limited: "20-100"
                },
                {
                    error_limited: "50-100",
                    monitor_status: "error",
                    update_time: "2017-04-14 10:40:35",
                    title: "检测处理器",
                    monitor_class: "cpu",
                    monitor_value: "60",
                    alert_limited: "70-80"
                }
            ];
            let totalCount = 10;
            let deviceList = [{
                id: 1,
                title: "报表计算机",
                role: "pc",
                department: "昌吉公路局",
                content_type: 13,
                content_type_name: "bureau",
                username: "root",
                password: "future",
                description: "测试",
                brand: "DELL",
                model_number: "I7",
                cpu: 321,
                mem: 312,
                disk: 321,
                ip: "10.65.8.70",
                operate_system: "windows_10",
                up_time: 312,
                ping_status: "None",
                software_list:sofeware_list,
                monitors: monitors
            }];
            let pageInfo = {
                endCursor: 5,
                hasNextPage: true
            };
            return new DeviceList(totalCount,deviceList,pageInfo);
            // return message;
        }
    }
};