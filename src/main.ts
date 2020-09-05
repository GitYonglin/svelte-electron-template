/*
 * @Author: your name
 * @Date: 2020-08-08 08:05:39
 * @LastEditTime: 2020-08-31 18:05:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\src\main.ts
 */
import './style/global.scss'
import './style/font/font.scss'

declare function require(name: string);

import App from './App.svelte';
import { comlink } from "./store/stores";

window['sysElectron'] = navigator.userAgent.indexOf("Electron") > -1;
if (window['sysElectron']) {
	const { modbusCmd } = require("electron").remote.require("./modbus");
	window['modbusCmd'] = modbusCmd;
	// serial();
	// socket();
}
/** 串口功能 */
function serial() {
	const { createSerialPort, modbusCmd } = require("electron").remote.require("./modbus");
	const serial = createSerialPort();
	window['serial'] = serial;
	getPorts(serial);
	/** 获取设备串口 */
	function getPorts(serial) {
		console.log(serial);
		if (serial) {
			serial.getLists().then((data) => {
				console.log("25====>", data);
				// if (data && !serial.port) {
				//   const port = serial.createPort();
				// }
				createPort(serial);
			});
		}
	}
	function createPort(serial) {
		// ipc.send("create_port");
		serial
			.createPort()
			.then((data) => {
				console.log("58==>", data);

				comlink.update(c => data);
			})
			.catch((error) => {
				console.error("58==>", error);
			});
	}
}

/** socket TCP */
function socket() {
	if (window.Worker) {
		var worker = new Worker("./worker/worker.js");
		console.log("66=>>>>", 'SocketTCP');

		worker.postMessage('SocketTCP');
		worker.onmessage = function (e) {
			console.log("当前脚本接收到的数据：", e.data);
		};
	}
}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;