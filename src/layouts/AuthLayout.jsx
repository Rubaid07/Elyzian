import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../component/Navbar';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-67px)] bg-gray-50'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;