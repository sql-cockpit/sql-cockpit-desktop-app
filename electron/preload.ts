import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('sqlCockpit', Object.freeze({ getVersion: (): Promise<string> => ipcRenderer.invoke('app:version') }));
