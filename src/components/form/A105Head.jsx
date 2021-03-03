import React from 'react'
import { useTranslation } from 'react-i18next'

import useUserInfo from '../../utils/useUserInfo'

export default function A105Head() {

    const {userInfo} = useUserInfo();
    const { t } = useTranslation(["A105", "alert"]);


    return (
        <div>
            <h2 className="vl-title vl-title--h2 vl-title--has-border">
                {t('A105:General')}
            </h2>
            <div className="vl-grid">
                <div className="form-group vl-form-col--8-12">
                    <label className="vl-form__label" >
                        {t('A105:List name')}
                    </label>
                    <input
                        className="vl-input-field vl-input-field--block"
                        disabled={true}
                        value={userInfo ? userInfo.lists[0].name : ""}
                    />
                </div>
                <div className="form-group vl-form-col--4-12">
                    <label className="vl-form__label" >
                        {t('A105:List number')}
                    </label>
                    <input
                        className="vl-input-field vl-input-field--block"
                        disabled={true}
                        value={userInfo ? userInfo.lists[0].number : ""}
                    />
                </div>
                <div className="form-group vl-form-col--8-12">
                    <label className="vl-form__label" >
                        {t('A105:Municipal administration')}
                    </label>
                    <input
                        className="vl-input-field vl-input-field--block"
                        disabled={true}
                        value={userInfo ? userInfo.municipality : ""}
                    />
                </div>
                <div className="form-group vl-form-col--4-12">
                    <label className="vl-form__label" >
                        {t('A105:Place on the list')}
                    </label>
                    <input
                        className="vl-input-field vl-input-field--block"
                        disabled={true}
                        value={userInfo ? userInfo.lists[0].position : ""}
                    />
                </div>
            </div>
        </div>
    )
}