import React, { useContext } from 'react';
import Navbar from '../component/Navbar';
import { Outlet } from 'react-router';
import Footer from '../component/Footer';
import { AuthContext } from '../context/AuthContext';
import LoadingLogo from '../component/Loader/LoadingLogo';
import ScrollToTop from '../component/ScrollToTop';

const MainLayout = () => {
    const { loading } = useContext(AuthContext);
    return (
        <div>
            <ScrollToTop></ScrollToTop>
            <Navbar></Navbar>
            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingLogo />
                </div>
            ) : (
                    <div className='min-h-[calc(100vh-418px)]'>
                        <Outlet />
                    </div>
            )}
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;