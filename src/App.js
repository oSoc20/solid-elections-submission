import React, { Suspense } from 'react';
import Header from "./components/header";
import './App.sass';

function App() {
    return (
        <Suspense fallback="loading">
            <Header />
        </Suspense>
    );
}

export default App;