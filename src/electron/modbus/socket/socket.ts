// import { Socket } from "net";
import { returnData16 } from "../callpackData";
import { modbusCmd } from "../CMD";
// import net from "net";
const net = require("net")

// interface ConnectionStr {
//     /** ip */
//     ip: string;
//     /** 端口号 */
//     port: number;
//     /** PLC地址 */
//     address: number;
//     /** 通信延时 */
//     setTimeout: number;
//     /** 通信模式 */
//     mode: ModbusMode;
//     /** 心跳地址 */
//     heartbeatAddress: number;
//     /** 重连延时toLinkTime */
//     toLinkTime: number;
//     /** uid */
//     uid: string;
//   }

class SocketTCP {
    client;
    connectionStr;
    sendCmd: Array<any>;
    /** 发送命令状态 */
    writeState: boolean;
    callback: (data: any) => {};
    connectCallback: (data: any) => any;
    errorCallback: (data: any) => any;

    constructor(connstr) {
        this.sendCmd = [];
        this.writeState = false;
        this.connectionStr = connstr;
        this.connectTCP(connstr);
    }

    connectTCP(connstr) {
        console.log('36=>', this.connectionStr);
        const client = new net.Socket();
        if (connstr.mode === 'ascii') {
            client.setEncoding('utf8');
        } else if (connstr.mode === 'tcp') {
            client.setEncoding('hex');
        }
        client.setNoDelay(true);
        client.connect(connstr.port, connstr.ip);
        client.setTimeout(connstr.setTimeout);
        client.on('data', (data) => {
            console.log('48=>', data);
            this.pack(true, data);
        });
        client.on('timeout', (data) => {
            console.log('58=>', data);
            this.pack(false, null);
        });
        client.on('connect', (data) => {
            console.log('connect =>', data);
            if (this.connectCallback) {
                this.connectCallback(data);
            }
            // const cmd = modbusCmd(1, 3, 4096, 20, "int32", "tcp");
            // client.write(cmd);
            // console.log(cmd);
        });
        client.on('error', (data) => {
            console.log('connect =>', data);
            // const cmd = modbusCmd(1, 3, 4096, 20, "int32", "tcp");
            // client.write(cmd);
            // console.log(cmd);
        });
        this.client = client;
    }

    /** 取消链接 */
    closeLink() {
        this.client.end();
        this.client.destroy();
        this.connectionStr = null;
        this.client = null;
    }
    /** 写入命令 */
    writeComm(cmd, callback) {
        if (!this.sendCmd.some(c => c.cmd === cmd)) {
            this.sendCmd.unshift({ cmd, callback });
        }
        if (!this.writeState && this.sendCmd.length > 0) {
            const c = this.sendCmd.pop();
            console.log('72=>', c);
            this.writeState = true;
            this.write(c.cmd, c.callback);
        }
        console.log('CMDS', this.sendCmd);
        console.log('CMDSlength', this.sendCmd.length);
    }
    write(cmd, callback) {
        console.time('statr');
        this.writeState = true;
        setTimeout(() => {
            this.callback = callback;
            console.log('43====', cmd);
            this.client.write(cmd, data => {
                console.log('45====', data);
            });
            // this.writeTime = setTimeout(() => {
            //     this.pack(false, `${cmd}获取数据超时`);
            // }, 150);
        }, 1);
    }
    /** 返回请求数据 */
    pack(success, data) {
        const pg = { success, data: success ? returnData16(data, 'tcp') : data };
        console.log(`pack >> ${pg}`);
        if (this.callback) {
            this.callback(pg);
        }
        this.callback = null;
        console.timeEnd('statr');
        this.writeState = false;
        // clearTimeout(this.writeTime);
        const cmd = this.sendCmd.pop();
        if (cmd) {
            this.write(cmd.cmd, cmd.callback);
        }
    }
    // /**
    //  * 直接发送命令
    //  *
    //  * @param {string} cmd 命令数据
    //  * @memberof Modbus
    //  */
    // writeCmd(cmd) {
    //     return this.client.write(cmd);
    // }
    // createCMD(fc, address, data, dataType) {
    //     return modbusCmd(1, fc, address, data, dataType, 'tcp');
    // }
    FC30(address, data, callback) {
        const cmd = modbusCmd(1, 3, Number(address), data, "int32", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC3(address, data, callback) {
        const cmd = modbusCmd(1, 3, 4096 + Number(address), data, "int32", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC5(address, data, callback) {
        const cmd = modbusCmd(1, 5, 2048 + Number(address), data, "int32", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC6(address, data, callback) {
        const cmd = modbusCmd(1, 6, 4096 + Number(address), data, "", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC15(address, data, callback) {
        const cmd = modbusCmd(1, 15, 2048 + Number(address), data, "int32", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC16Float(address, data, callback) {
        const cmd = modbusCmd(1, 16, 4096 + Number(address), data, "float", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }
    FC16Int32(address, data, callback) {
        const cmd = modbusCmd(1, 16, 4096 + Number(address), data, "int32", "tcp");
        console.log("139", cmd);
        this.writeComm(cmd, callback);
    }

}


const connStr = {
    /** ip */
    ip: "192.168.1.101",
    /** 端口号 */
    port: 502,
    /** PLC地址 */
    address: 1,
    /** 通信延时 */
    setTimeout: 1000,
    /** 通信模式 tcp udp ascii */
    mode: "ascii",
    /** 心跳地址 */
    heartbeatAddress: 4096,
    /** 重连延时toLinkTime */
    toLinkTime: 5000,
    /** uid */
    uid: "a1",
};
// const soc = new SocketTCP(connStr);
// console.log(soc);

export {
    SocketTCP
}