import React, { useState } from "react";
import Help from "../alert/help";
import InputAmount from './inputAmount';
import { useTranslation } from 'react-i18next';

export default function A105Funds(props) {

    const { t } = useTranslation(["A105", "alert"]);

    const [patrimony, setPatrimony] = useState(0);

    const [donations1, setDonations1] = useState(0);
    const [donations2, setDonations2] = useState(0);
    
    const [sponsorship1, setSponsorship1] = useState(0);
    const [sponsorship2, setSponsorship2] = useState(0);

    const [politicalParty, setPoliticalParty] = useState(0);

    const [otherSource, setOtherSource] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);

    const handleChange = function(event) {
        const target = event.target;
        validateChange(target.id, target.value);
        updateState(target.id, target.value);
    }

    const validateChange = function(id, value) {
        return true;
    }

    const updateState = function(id, value) {
        if (id == 'patrimony') {
            setPatrimony(value);
        } else if (id == 'donations1') {
            setDonations1(value);
        } else if (id == 'donations2') {
            setDonations2(value);
        } else if (id == 'sponsorship1') {
            setSponsorship1(value);
        } else if (id == 'sponsorship2') {
            setSponsorship2(value);
        } else if (id == 'politicalParty') {
            setPoliticalParty(value);
        } else if (id == 'otherSource') {
            setOtherSource(value);
        }
    }

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
                        var="patrimony"
                        label=""
                        handleChange={handleChange}
                        val={patrimony}
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
                        var="donations1"
                        label={t('A105:Gifts of 125 euros or more per donor') + ":"}
                        handleChange={handleChange}
                        val={donations1}
                        help=""
                        min="125"
                        message="Let op! U vult giften in die €125 of hoger bedragen. Vul daarom ook het formulier voor de identificatie van de schenkers en sponsors in."
                    />
                </div>

                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="donations2"
                        label={t('A105:Gifts of less than 125 euros per donor') + ":"}
                        handleChange={handleChange}
                        val={donations2}
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
                        var="sponsorship1"
                        label={t('A105:Amounts of 125 euros or more per sponsor"') + ":"}
                        handleChange={handleChange}
                        val={sponsorship1}
                        help=""
                        min="125"
                        message="Let op! U vult sponsoring in die €125 of hoger bedraagt. Vul daarom ook het formulier voor de identificatie van de schenkers en sponsors in."
                    />
                </div>

                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="sponsorship2"
                        label={t('A105:Amounts of less than 125 euros per sponsor') + ":"}
                        handleChange={handleChange}
                        val={sponsorship2}
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
                        var="politicalParty"
                        label=""
                        handleChange={handleChange}
                        val={politicalParty}
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
                        var="otherSource"
                        label=""
                        handleChange={handleChange}
                        val={otherSource}
                        help=""
                    />
                </div>
            </div>

            <p className="total-text">
                {t('A105:Total amount') + ": " +  totalAmount}€
            </p>
        </div>
    );
}