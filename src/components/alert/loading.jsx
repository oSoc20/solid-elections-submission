import React from 'react';

export default function Loading() {
  return (
    <div class="vl-col--1-1">
        <div class="vl-region">
            <div class="vl-u-align-center">
                <div class="vl-loader" role="alert" aria-busy="true"></div>
                <p>Pagina laadt, even wachten aub...</p>
            </div>
        </div>
    </div>
  );
}
