import React, { useState, useEffect } from "react";
import { createAppDocument } from '../../utils/SolidWrapper';
import Loading from '../alert/loading';
import ProfileDoesntExist from '../alert/profileDoesntExist';
import { Redirect } from 'react-router-dom';
import ReactTooltip from "react-tooltip";
import deadlines from '../../data/deadline.json';
import A105Expenses from "./A105Expenses";
import A105Funds from "./A105Funds";
import { useTranslation } from 'react-i18next';
import useExpensesForm from '../../utils/useExpensesForm';
import useFundsForm from '../../utils/useFundsForm';

export default function A105(props) {

    const FILE_NAME_PROFILE = "me.ttl";
    const FILE_ID = "a105";
    const FILE_NAME = FILE_ID + ".ttl";

    const { t } = useTranslation(["A105", "alert"]);

    const [loaded, setLoadedState] = useState(props.loaded);
    const [completeProfile, setCompleteProfile] = useState(false);
    const [listName, setListName] = useState('');
    const [listNb, setListNb] = useState(0);
    const [municipality, setMunicipality] = useState('');
    const [listPosition, setListPosition] = useState(0);
    const [completeForm, setCompleteForm] = useState(false);
    const [maxExpensesAmount, setMaxExpensesAmount] = useState(0);
    const [redirect, setRedirect] = useState(false);

    const {handleExpensesChange, handleExpensesSubmit,
            expensesValues, expensesTotal} = useExpensesForm();
    const {handleFundsChange, handleFundsSubmit,
            fundsValues, fundsTotal} = useFundsForm();

    useEffect(() => {
        setLoadedState(props.loaded);
    });

    useEffect(() => {
        let userInfo = props.userInfo;
        if (userInfo != null) {
            setCompleteProfile(true);
            setListName(
                userInfo.lists[0].name
            );
            setListNb(
                userInfo.lists[0].number
            );
            setMunicipality(
                userInfo.address.municipality
            );
            setListPosition(
                userInfo.lists[0].position
            );
            setMaxExpensesAmount(
                userInfo.userAmount
            );
        } else {
            setCompleteProfile(false);
        }
    }, [loaded]);

    const anabeCompleteForm = function() {
        setCompleteForm(true);
    }

    const disableCompleteForm = function() {
        setCompleteForm(false);
    }

    const handleSubmit = function(event) {
        event.preventDefault();

        let errorForm = document.getElementById("error-form");
        if (expensesTotal != fundsTotal) {
            console.log('expenses != funds');
            errorForm.innerText = "Het totaalbedrag van de uitgaven is niet gelijk aan het totaalbedrag van de herkomst van de geldmiddelen";
            return false;
        } else {
            errorForm.innerText = "";
        }

        let dataToSave = []
        let doc = createAppDocument(props.userInfo.appContainer, FILE_NAME);

        let errorFree = handleExpensesSubmit(doc, props.userInfo.profile, dataToSave);
        if (!errorFree) {
            return false;
        }
        errorFree = handleFundsSubmit(doc, props.userInfo.profile, dataToSave);
        if (!errorFree) {
            return false;
        }

        console.log(dataToSave);

        doc.save(dataToSave).then(function(e) {
            setRedirect(true);
        });
    };

    if (! loaded) {
        return (
            <Loading />
        );
    } else {
        if (! completeProfile) {
            return (
                <ProfileDoesntExist />
            );
        } else {
            if (redirect) {
                return (
                    <Redirect to='/formSent' />
                );
            } else {
                return (
                    <div id="userForm">
                        <h1 
                        className="vl-title vl-title--h1 vl-title--has-border">
                            {t('A105:Declaration of election expenses and of the origin of the funds by candidates')}
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <h2 
                            className="vl-title vl-title--h2 vl-title--has-border">
                                {t('A105:General')}
                            </h2>
                            <div className="vl-grid">
                                <div className="form-group vl-form-col--8-12">
                                    <label 
                                    className="vl-form__label" 
                                    htmlFor="Gnamelist">
                                        {t('A105:List name')} :
                                    </label>
                                    <input 
                                    type="text" 
                                    id="Gnamelist" 
                                    disabled={true} 
                                    className="vl-input-field vl-input-field--block" 
                                    value= {listName}
                                    name="Gnamelist"></input>
                                    <p 
                                    className="vl-form__error" 
                                    id="input-field-Gnamelist-error"></p>
                                </div>

                                <div className="form-group vl-form-col--4-12">
                                    <label 
                                    className="vl-form__label" 
                                    htmlFor="Gtrackingnumber">
                                        {t('A105:List number')} :
                                    </label>
                                    <input 
                                    type="number" 
                                    min="0" 
                                    disabled={true} 
                                    id="Gtrackingnumber" 
                                    className="vl-input-field vl-input-field--block" 
                                    value={listNb} 
                                    name="Gtrackingnumber"></input>
                                    <p 
                                    className="vl-form__error" 
                                    id="input-field-Gtrackingnumber-error"></p>
                                </div>

                                <div className="form-group vl-form-col--8-12">
                                    <label 
                                    className="vl-form__label" 
                                    htmlFor="Ggemeente">
                                        {t('A105:Municipal administration')} :
                                    </label>
                                    <input 
                                    type="text" 
                                    disabled={true} 
                                    id="Ggemeente" 
                                    className="vl-input-field vl-input-field--block" 
                                    value={municipality} 
                                    name="Ggemeente"></input>
                                    <p 
                                    className="vl-form__error" 
                                    id="input-field-Ggemeente-error"></p>
                                </div>

                                <div className="form-group vl-form-col--4-12">
                                    <label 
                                    className="vl-form__label" 
                                    htmlFor="GlistPosition">
                                        {t('A105:Place on the list')} :
                                    </label>
                                    <input 
                                    type="number" 
                                    min="0" 
                                    disabled={true} 
                                    id="GlistPosition" 
                                    className="vl-input-field vl-input-field--block" 
                                    value={listPosition} 
                                    name="GlistPosition"></input>
                                    <p 
                                    className="vl-form__error" 
                                    id="input-field-GlistPosition-error"></p>
                                </div>

                                <p>
                                    {t('A105:As a candidate for the October 14, 2018 elections, did you make any election expenses')}?
                                </p>
                                <div className="form-group vl-form-col--12-12">
                                    <label className="vl-radio" htmlFor="GElectionExpenseYes">
                                        <input 
                                        className="vl-radio__toggle" 
                                        type="radio" 
                                        id="GElectionExpenseYes" 
                                        name="GElectionExpense" 
                                        value="yes"
                                        onClick={anabeCompleteForm}
                                        checked={completeForm} />
                                        <div className="vl-radio__label">
                                            {t('A105:Yes')}
                                        </div>
                                    </label>
                                    <label className="vl-radio" htmlFor="GElectionExpenseNo">
                                        <input 
                                        className="vl-radio__toggle" 
                                        type="radio" 
                                        id="GElectionExpenseNo" 
                                        name="GElectionExpense" 
                                        value="no"
                                        onClick={disableCompleteForm}  
                                        checked={! completeForm} />
                                        <div className="vl-radio__label">
                                            {t('A105:No')}
                                        </div>
                                    </label>
                                </div>

                                <A105Expenses 
                                    show={completeForm}
                                    maxAmount={maxExpensesAmount}
                                    handleExpensesChange={handleExpensesChange}
                                    expensesValues={expensesValues}
                                    expensesTotal={expensesTotal}
                                />

                                <A105Funds 
                                    show={completeForm}
                                    handleFundsChange={handleFundsChange}
                                    fundsValues={fundsValues}
                                    fundsTotal={fundsTotal}
                                />

                            </div>

                            <p id="error-form" className="vl-form__error"></p>
                            <p className="text-bold">
                                {t('A105:Submit this form at the latest on ')} {deadlines.forms[FILE_ID].deadline}.
                            </p>
                            <button 
                                id="sendButton" 
                                className="vl-button mt-5" 
                                disabled={false}>
                                    <span className="vl-button__label">
                                        {t('A105:Sign and send')}
                                    </span>
                            </button>

                        </form>
                        <ReactTooltip />
                    </div>
                );
            }
        }
    }
};