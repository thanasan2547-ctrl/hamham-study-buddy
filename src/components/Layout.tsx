import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
    return (
        <div className="app-layout">
            <div className="page-with-nav">
                <Outlet />
            </div>
            <Navigation />
        </div>
    );
}
