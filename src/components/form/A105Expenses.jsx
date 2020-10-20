import React from "react";
import Help from "../alert/help";
import { useTranslation } from 'react-i18next';

export default function A105Expenses(props) {

    const { t } = useTranslation(["A105", "alert"]);

    return (
        <div 
        id="sectionElectionExpenditure" 
        className={props.show ? "" : "vl-u-hidden"}>
            <h2 className="vl-title vl-title--h2 vl-title--has-border">
                Aangifte van de verkiezingsuitgaven
                <Help message={[
                    <p>
                        {t('alert:State here all expenses and financial commitments for verbal, written, auditory and visual messages that were made during the closed period and that aimed to favorably affect the election result of the list')}.
                        </p>,
                    <p>
                        {t('alert:Also state here the expenses incurred by third parties for the list')}.{" "} 
                        {t("alert:You do not need to declare those expenses if, immediately after becoming aware of the campain they were conducting, the list sent a letter of formal notice to third parties to stop the compaign and has provided a copy that certified letter to the president of the election headquarters, whether or not accompanied by the third party's agreement to suspension")}.{" "} 
                        {t('alert:Enclose that copy with this declaration')}. 
                        
                    </p>,
                    <p>
                        {t('alert:Expenditures and financial commitments for goods, supplies and services must be settled at prevailing marked prices')}.
                    </p>,
                    <p>
                        {t('alert:Attention')}!{" "} 
                        {t('alert:When completing the declaration, keep in mind that the use of certain campaign resources is prohibited dring the closed period')}.{" "} 
                        {t('alert:Lists, as well as third parties who want to make propaganda for them, are not allowed during the closed period')}:
                    </p>,
                    <ul>
                        <li>- {t('alert:to sell or distribute gifts or gadgets')}</li>
                        <li>- {t('alert:to conduct commercial telephone campaigns')}</li>
                        <li>- {t('alert:to use commercial billboards or posters')}</li>
                        <li>- {t('alert:to use non-commercial billboards or posters that are larger than 4 m²')}</li>
                        <li>- {t('alert:to use commercial radio, television or cinema advertisements')}</li>
                    </ul>
                ]}/>
            </h2>
        </div>
    );
}