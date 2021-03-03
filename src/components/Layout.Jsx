import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from './header';
import Footer from './footer';

const Layout = ({children}) => {

    //Load all translation files
    const { t } = useTranslation(
        ["A105", "alert", "footer", "form", "header", "translation"]
    );

    return (
        <div>
            <Header/>
                <section className='vl-region'>
                    <div className='vl-layout'>
                        {children}
                    </div>
                </section>
            <Footer/>
        </div>
    )
}

export default Layout;