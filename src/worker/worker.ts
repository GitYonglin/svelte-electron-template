/*
 * @Author: your name
 * @Date: 2020-08-30 22:50:34
 * @LastEditTime: 2020-08-31 13:22:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\public\worker\worker.js
 */
// const SocketTCP = require("../../src/modbus/socket/socket");
import { SocketTCP } from "../electron/modbus";

addEventListener('message', (e) => {
    console.log('work接收到的数据为：build', e.data, SocketTCP);
    createSocketTCP();
});

postMessage("你好，我是worker发来的数据", null)

function createSocketTCP() {
    console.warn("你好，我是worker发来的数据 ==> connectCallback");

    const connStr = {
        /** ip */
        ip: `127.0.0.1`,
        /** 端口号 */
        port: 8899,
        /** PLC地址 */
        address: 1,
        /** 通信延时 */
        setTimeout: 150,
        /** 通信模式 tcp udp ascii */
        mode: "tcp",
        /** 心跳地址 */
        heartbeatAddress: 4096,
        /** 重连延时toLinkTime */
        toLinkTime: 5000,
        /** uid */
        uid: "a1",
    };
    // const socket = window["socketTCP"];
    const tcpClient = new SocketTCP(connStr);
    tcpClient.connectCallback = (data) => {
        console.warn("connectCallback", data);
        postMessage("修改一些东西可以看到吗", null)
        setInterval(() => {
            tcpClient.FC30(0, 10, (data) => {
                postMessage({ msg: 'worket', data: data }, null)
            })
        }, 5000);
    };
    tcpClient.errorCallback = (data) => {
        console.error("errorCallback", data);
        tcpClient.closeLink();
    };

}

