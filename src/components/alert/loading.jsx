import React, {Suspense} from 'react';
import { useTranslation } from 'react-i18next';

export default function Loading() {

  const { t } = useTranslation(["alert"])

  return (
    <div className="vl-col--1-1">
        <div className="vl-region">
            <div className="vl-u-align-center">
                <div className="vl-loader" role="alert" aria-busy="true"></div>
                <p>{t('The page is loading')}, {t('please wait a moment')}...</p>
            </div>
        </div>
    </div>
  );
}
