import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/router';
import { store } from './stores/configureStore';
import './styles/index.scss';
import './styles/global.scss';
import { App, ConfigProvider } from 'antd';
import theme from './components/ThemeConfig';
import viVN from 'antd/locale/vi_VN';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider theme={theme} locale={viVN}>
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  </Provider>,
  // </React.StrictMode>,
);
