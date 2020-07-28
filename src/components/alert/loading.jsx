import React from 'react';

export default function Loading() {
  return (
    <div className="vl-col--1-1">
        <div className="vl-region">
            <div className="vl-u-align-center">
                <div className="vl-loader" role="alert" aria-busy="true"></div>
                <p>Pagina laadt, even wachten aub...</p>
            </div>
        </div>
    </div>
  );
}
