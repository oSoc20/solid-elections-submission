import React from "react";
import Help from "../alert/help";
import InputAmount from './inputAmount';
import { useTranslation } from 'react-i18next';
import useExpensesForm from '../../utils/useExpensesForm';

export default function A105Expenses(props) {

    const { t } = useTranslation(["A105", "alert"]);

    const {handleExpensesChange, expensesValues, total} = useExpensesForm();

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

            <p className="text-bold">
                {t('A105:The maximum amount that you can spend as a candidate, is')} {props.maxAmount}€.
            </p>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('Auditory and verbal messages')}
                <Help message={
                    t('A105:For example') + ": " + 
                    t('A105:non-commercial telephone campaings or an indelible political message on an information carrier')
                } />
            </h3>
            <div className="vl-grid">
                <div className="form-group">
                    <InputAmount
                        var="EAuditoryAndOral"
                        label=""
                        handleChange={handleExpensesChange}
                        val={expensesValues.EAuditoryAndOral}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                 {t('A105:Written messages')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage1_1"
                        label= {t('A105:Design and production costs of advertisement in the press') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage1_1}
                        help={"Written messages - Design and production costs in the press"}
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage1_2"
                        label={t('A105:Price for advertising space in the press') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage1_2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage2"
                        label={t('A105:Design and production costs of election flyers') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage3"
                        label={t('A105:Cost of letters and envelopes') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage3}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage4"
                        label={t('A105:Cost of other printed matter') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage4}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EWrittenMessage5"
                        label={t('A105:Charges for emails and non-commercial SMS campaigns') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EWrittenMessage5}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Shipping and distribution costs for election propaganda')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EShippingAndDistribution1_1"
                        label={t('Addressed shipments') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EShippingAndDistribution1_1}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EShippingAndDistribution1_2"
                        label={t('Non-addressed shipments') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EShippingAndDistribution1_2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EShippingAndDistribution2"
                        label={t('Postal charges for other shipments') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EShippingAndDistribution2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EShippingAndDistribution3"
                        label={t('Other distribution costs') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EShippingAndDistribution3}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Visual messages')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EVisualMessage1"
                        label={t('Production and rental costs for non-commercial boards of 4m² or less') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EVisualMessage1}
                        help={
                            t('A105:Production and rental costs for non-commercial boards of 4m² or less') + ". " +
                            t('A105:The cost of the boards created or purchased can be written off over three elections in which the political party participates, with a minimum of one third of the cost per election') + ". " + 
                            t('A105:If those signs have been rented, the rental price must be stated in its entirety') + ". " +
                            t('A105:The rental prices must be commercially justified (one third of the actual cost price for example)') + ". " +
                            t('A105:The use of fully written off signs does not need to be indicated')
                        }
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EVisualMessage2"
                        label={t('A105:Printing and production costs for posters of 4m² or less') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EVisualMessage2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EVisualMessage3"
                        label={t('A105:Commercials on the Internet of Internet campaigns') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EVisualMessage3}
                        help=""
                    />
                </div>               
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EVisualMessage4"
                        label={t('A105:Other costs for visual messages') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EVisualMessage4}
                        help=""
                    />
                </div>
            </div>

            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {t('A105:Other expenses')}
            </h3>
            <div className="vl-grid">
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EOtherCost1"
                        label={t('A105:Election events') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EOtherCost1}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EOtherCost2"
                        label={t('A105:Production costs for website or web page, designed for election purposes') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EOtherCost2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="EOtherCost3"
                        label={t('A105:Other') + ":"}
                        handleChange={handleExpensesChange}
                        val={expensesValues.EOtherCost3}
                        help=""
                    />
                </div>
            </div>

            <p className="total-text mb-5">
                {t('A105:Total amount') + ": " +  total}€
            </p>
        </div>
    );
}