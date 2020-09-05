/*
 * @Author: your name
 * @Date: 2020-08-26 17:03:03
 * @LastEditTime: 2020-08-29 16:10:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\src\store\strotes.ts
 */
import { writable } from 'svelte/store';

export const comlink = writable<boolean>(false);
export const deviceLive = writable<{ time: number, dev: number, data: Array<any>, name: string }>({ time: 0, dev: 0, data: [], name: "" });
