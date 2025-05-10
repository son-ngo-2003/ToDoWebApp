import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import './styles/index.css';
import { ErrorPage, HomePage, LabelPage } from './pages';
import { Drawer } from './components';

const Root: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="light-theme App">
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
