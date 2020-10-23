import React, {useState} from "react";
import Help from "../alert/help";
import InputAmount from './inputAmount';
import { useTranslation } from 'react-i18next';

export default function A105Expenses(props) {

    const { t } = useTranslation(["A105", "alert"]);

    const [auditoryOral, setAuditoryOral] = useState(0);

    const [written11, setWritten11] = useState(0);
    const [written12, setWritten12] = useState(0);
    const [written2, setWritten2] = useState(0);
    const [written3, setWritten3] = useState(0);
    const [written4, setWritten4] = useState(0);
    const [written5, setWritten5] = useState(0);

    const [shippingDistribution11, setShippingDistribution11] = useState(0);
    const [shippingDistribution12, setShippingDistribution12] = useState(0);
    const [shippingDistribution2, setShippingDistribution2] = useState(0);
    const [shippingDistribution3, setShippingDistribution3] = useState(0);

    const [visual1, setVisual1] = useState(0);
    const [visual2, setVisual2] = useState(0);
    const [visual3, setVisual3] = useState(0);
    const [visual4, setVisual4] = useState(0);

    const [other1, setOther1] = useState(0);
    const [other2, setOther2] = useState(0);
    const [other3, setOther3] = useState(0);

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
        if (id == 'auditoryOral') {
            setAuditoryOral(value);
        } else if (id == 'written11') {
            setWritten11(value);
        } else if (id == 'written12') {
            setWritten12(value);
        } else if (id == 'written2') {
            setWritten2(value);
        } else if (id == 'written3') {
            setWritten3(value);
        } else if (id == 'written4') {
            setWritten4(value);
        } else if (id == 'written5') {
            setWritten5(value);
        } else if (id == 'shippingDistribution11') {
            setShippingDistribution11(value);
        } else if (id == 'shippingDistribution12') {
            setShippingDistribution12(value);
        } else if (id == 'shippingDistribution2') {
            setShippingDistribution2(value);
        } else if (id == 'shippingDistribution3') {
            setShippingDistribution3(value);
        } else if (id == 'visual1') {
            setVisual1(value);
        } else if (id == 'visual2') {
            setVisual2(value);
        } else if (id == 'visual3') {
            setVisual3(value);
        } else if (id == 'visual4') {
            setVisual4(value);
        } else if (id == 'other1') {
            setOther1(value);
        } else if (id == 'other2') {
            setOther2(value);
        } else if (id == 'other3') {
            setOther3(value);
        }
    }

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
                        var="auditoryOral"
                        label=""
                        handleChange={handleChange}
                        val={auditoryOral}
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
                        var="written11"
                        label= {t('A105:Design and production costs of advertisement in the press') + ":"}
                        handleChange={handleChange}
                        val={written11}
                        help={"Written messages - Design and production costs in the press"}
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="written12"
                        label={t('A105:Price for advertising space in the press') + ":"}
                        handleChange={handleChange}
                        val={written12}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="written2"
                        label={t('A105:Design and production costs of election flyers') + ":"}
                        handleChange={handleChange}
                        val={written2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="written3"
                        label={t('A105:Cost of letters and envelopes') + ":"}
                        handleChange={handleChange}
                        val={written3}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="written4"
                        label={t('A105:Cost of other printed matter') + ":"}
                        handleChange={handleChange}
                        val={written4}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="written5"
                        label={t('A105:Charges for emails and non-commercial SMS campaigns') + ":"}
                        handleChange={handleChange}
                        val={written5}
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
                        var="shippingDistribution11"
                        label={t('Addressed shipments') + ":"}
                        handleChange={handleChange}
                        val={shippingDistribution11}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="shippingDistribution12"
                        label={t('Non-addressed shipments') + ":"}
                        handleChange={handleChange}
                        val={shippingDistribution12}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="shippingDistribution2"
                        label={t('Postal charges for other shipments') + ":"}
                        handleChange={handleChange}
                        val={shippingDistribution2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="shippingDistribution3"
                        label={t('Other distribution costs') + ":"}
                        handleChange={handleChange}
                        val={shippingDistribution3}
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
                        var="visual1"
                        label={t('Production and rental costs for non-commercial boards of 4m² or less') + ":"}
                        handleChange={handleChange}
                        val={visual1}
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
                        var="visual2"
                        label={t('A105:Printing and production costs for posters of 4m² or less') + ":"}
                        handleChange={handleChange}
                        val={visual2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="visual3"
                        label={t('A105:Commercials on the Internet of Internet campaigns') + ":"}
                        handleChange={handleChange}
                        val={visual3}
                        help=""
                    />
                </div>               
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="visual4"
                        label={t('A105:Other costs for visual messages') + ":"}
                        handleChange={handleChange}
                        val={visual4}
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
                        var="other1"
                        label={t('A105Election events') + ":"}
                        handleChange={handleChange}
                        val={other1}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="other2"
                        label={t('A105:Production costs for website or web page, designed for election purposes') + ":"}
                        handleChange={handleChange}
                        val={other2}
                        help=""
                    />
                </div>
                <div className="form-group vl-form-col--6-12">
                    <InputAmount
                        var="other3"
                        label={t('A105:Other') + ":"}
                        handleChange={handleChange}
                        val={other3}
                        help=""
                    />
                </div>
            </div>

            <p className="total-text mb-5">
                Totaalbedrag: {totalAmount}€
            </p>
        </div>
    );
}