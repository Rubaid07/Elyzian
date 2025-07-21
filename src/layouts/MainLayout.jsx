import React, { useContext } from 'react';
import Navbar from '../component/Navbar';
import { Outlet } from 'react-router';
import Footer from '../component/Footer';
import { AuthContext } from '../context/AuthContext';
import LoadingLogo from '../component/Loader/LoadingLogo';

const MainLayout = () => {
    const { loading } = useContext(AuthContext);
    return (
        <div>
            <Navbar></Navbar>
            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingLogo />
                </div>
            ) : (
                <div className='bg-blue-50'>
                    <Outlet />
                </div>
            )}
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;