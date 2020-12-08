import React from 'react';
import Header from "./components/header";
import './App.sass';
import { useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation(["A105", "alert", "footer", "form", "header", "translation"]);

    return (
        <Header />
    );
}

export default App;