import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { Route, MemoryRouter as Router, Routes } from 'react-router';
import { ConfigProvider } from 'antd';
import Minimalist from './pages/Minimalist';

dayjs.locale('zh-cn');

const App = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <Router>
                <Routes>
                    <Route path="/" element={<Minimalist />} />
                </Routes>
            </Router>
        </ConfigProvider>
    );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

window.electron.ipcRenderer.on('log', (arg) => {
    console.log(arg);
});

// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

// const timeout = setTimeout(() => {
//     clearTimeout(timeout);
//     window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
// }, 2000);

// const interval = setInterval(() => {
//     window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
// }, 1000);
