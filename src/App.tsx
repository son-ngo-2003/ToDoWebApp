import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import './styles/index.css';
import { ErrorPage, HomePage, LabelPage } from './pages';
import { Drawer } from './components';
import { useTheme } from './hooks/ui';

const Root: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`${theme} App`}>
            <Drawer/>
            <div className='page-container'>
                {children ?? <Outlet />}
            </div>
        </div>
    )
}

export const router = createBrowserRouter([
    {
        Component: Root,
        errorElement: <Root><ErrorPage/></Root>,
        children: [
            { index: true, element: <HomePage /> },
            { path: '/labels/:labelId', element: <LabelPage /> },
        ],
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App
