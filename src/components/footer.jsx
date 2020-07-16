import React from 'react';

export default function Footer() {
  return (
        <footer class="vl-content-footer">
            <div class="vl-content-footer__wrapper">
                <div class="vl-layout">
                <div class="vl-grid vl-grid--is-stacked">
                    <div class="vl-col--1-4 vl-col--1-1--s">
                    <ul class="vl-link-list vl-link-list--small">
                        <li><a href="#">Subsidies</a></li>
                        <li><a href="#">Bedrijfsvoering</a></li>
                        <li><a href="#">Landbouwbeleid</a></li>
                        <li><a href="#">Voorlichting en info</a></li>
                    </ul>
                    </div>
                    <div class="vl-col--1-4 vl-col--1-1--s">
                    <ul class="vl-link-list vl-link-list--small">
                        <li><a href="#">Visserij</a></li>
                        <li><a href="#">Dier</a></li>
                        <li><a href="#">Plant</a></li>
                    </ul>
                    </div>
                    <div class="vl-col--1-4 vl-col--1-1--s">
                    <ul class="vl-link-list vl-link-list--small">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Nieuwsbrief</a></li>
                        <li><a href="#">Publicaties</a></li>
                    </ul>
                    </div>
                    <div class="vl-col--1-4 vl-col--1-1--s">
                    <img src="https://picsum.photos/400/180?image=1038" alt="Schatten in de Noordzee" />
                    </div>
                </div>
                </div>
            </div>
        </footer>
  );
}
