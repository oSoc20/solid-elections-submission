import React, { useState , useEffect } from "react";
import Help from "../alert/help";
import InputAmount from './inputAmount';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import useFundsForm from '../../utils/useFundsForm';
import { useTranslation } from 'react-i18next';

export default function A105Funds(props) {

    const { t } = useTranslation(["A105", "alert"]);

    const handleFundsChange = props.handleFundsChange;
    const fundsValues = props.fundsValues;
    const total = props.fundsTotal;

    return (
        <div 
            id="sectionOriginOfFund" 
            className={props.show ? "" : "vl-u-hidden"}>
            <h2 className="vl-title vl-title--h2 vl-title--has-border">
                {t('A105:Declaration of the origin of the funds')}: 
                <Help message={[
                    <p>
                        {t('alert:In this section, you make a breakdown of the election expenditures that your list has incurred according to the origin of the funds used to finance those expenditures') + ". "} 
                        {t('alert:The total amount of expenses included above must be equal to the total amount of the source of funds indicated below') + "."}
                    </p>,
                    <p>{t('alert:Gifts and sponsor amounts of 125 euros and more are transferred electronically by bank transfer, a permanent payment order, or a bank or credit card') + "."}</p>
                ]}/>
            </h2>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t("A105:Funds that come from the candidate's own assests")}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection1"
                        label=""
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection1}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Gifts')} 
                <Help message={[
                    <p>
                        {t('alert:Gifts in cash as well as gifts in kind are considered gifts') + ". "} 
                        {t('alert:The services provided free of charge or below real cost, the credit lines made available that do not have to be repaid and the services that are apparently charged by a political party, a list or a candidate above the market prices, are also considered as gifts') + ". "}
                        {t('alert:Only natural persons are allowed to make donations') + ". "}.
                        {t('alert:Gifts from legal persons or de facto associations, as well as gifts from natural persons who actually act as intermediaries of legal persons or de facto associations, are prohibited') + "."}
                    </p>,
                    <p>
                        {t('alert:Attention') + "! "}
                        {t('alert:The lists may finance their election propaganda with donations of a maximum of 500 euros per donor or its equivalent') + "."}
                    </p>
                ]}/>
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection2_1"
                        label={t('A105:Gifts of 125 euros or more per donor') + ":"}
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection2_1}
                        help=""
                        min="125"
                        message="Let op! U vult giften in die €125 of hoger bedragen. Vul daarom ook het formulier voor de identificatie van de schenkers en sponsors in."
                    />
                </div>

                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection2_2"
                        label={t('A105:Gifts of less than 125 euros per donor') + ":"}
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection2_2}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Sponsorship')} 
                <Help message={[
                    <p>
                        {t('alert:Sponsorship is understood to mean making money or products available in accordance with current market prices in exchange for publicity') + ". "}
                        {t('alert:Companies, de facto associations and legal persons are allowed to sponsor') + ". "}
                        {t('alert:A company is any natural or legal person who pursues an economic objective in a sustainable manner, as well as its associations') + "."}
                    </p>,
                    <p>
                        {t('alert:Attention') + "! "}
                        {t('alert:The lists may receive a maximum of 500 euros or its equivalent per sponsor') + "."}
                    </p>
                ]}/>
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection3_1"
                        label={t('A105:Amounts of 125 euros or more per sponsor') + ":"}
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection3_1}
                        help=""
                        min="125"
                    />
                </div>

                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection3_2"
                        label={t('A105:Amounts of less than 125 euros per sponsor') + ":"}
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection3_2}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Financing by (a component of) the political party')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection4"
                        label=""
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection4}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Different origin')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="FSection5"
                        label=""
                        handleChange={handleFundsChange}
                        val={fundsValues.FSection5}
                        help=""
                    />
                </div>
            </div>

            <p className="total-text">
                {t('A105:Total amount') + ": " +  total}€
            </p>
        </div>
    );
}