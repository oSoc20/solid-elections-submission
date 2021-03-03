import React,  {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux';

import formInfo from '../../data/a105.json'
import deadlines from '../../data/deadline.json'

import {formToHTML, getKey} from '../../utils/createA105Form'
import { requestExpensesLoad } from '../../actions/expensesInfo'
import useUserInfo from '../../utils/useUserInfo'
import useExpensesInfo from "../../utils/useExpensesInfo"

import A105Head from './A105Head'
import ProfileDoesntExist from '../alert/profileDoesntExist'
import Loading from '../alert/loading'

export default function A105({enableG104}) {

    const {register, handleSubmit, 
            errors, watch, setValue} = useForm();
    const [completeForm, setCompleteForm] = useState(false);
    const { t } = useTranslation(["A105", "alert"]);
    const dispatch = useDispatch();

    const {loaded, userInfo} = useUserInfo();
    const {saveData, expensesLoaded, expensesInfo} = useExpensesInfo();

    const values = watch();

    useEffect(() => {
        if (expensesLoaded && expensesInfo) {
            console.log("LOADED!");
            console.log(expensesInfo);
            expensesInfo.map(
                info => {
                    console.log(info.isExpense);
                    console.log(info.identifier);
                    console.log(getKey(info.identifier, info.isExpense));
                    console.log(info.price)
                    setValue(
                        getKey(info.identifier, info.isExpense), 
                        info.price
                    )
                }
            )
        }
    }, [expensesLoaded, loaded])

    const getTotals = () => {
        var expensesTotal = 0;
        var fundsTotal = 0;
        for (const key in values) {
            const amount = values[key];
            if (amount) {
                if (key.substr(0, 1) == "E") {
                    expensesTotal += amount;
                } else {
                    fundsTotal += amount;
                }
            }
        }

        return [expensesTotal.toFixed(2), fundsTotal.toFixed(2)]
    }

    const getExtraErrors = () => {
        const extraErrors = {}
        const amount1 = values[getKey("2.1.1", false)]
        var extraInfo = false
        if (amount1 && amount1 >= 125) {
            extraInfo = true
            extraErrors[getKey("2.1.1", false)] = t('alert:Attention') + "! " + t('alert:You are entering a sponsorship that is 125 euros or higher') + ". " 
            + t('alert:Therefore, also complete the form for identification of donors and sponsors') + ".";
        } else if (amount1 && amount1 > 0) {
            extraErrors[getKey("2.1.1", false)] = t('alert:The amount you entered is less than 125 euros, please enter it in the inputfield on the right') + "."
        }

        const amount2 = values[getKey("3.1.1", false)]
        if (amount2 && amount2 >= 125) {
            extraInfo = true
            extraErrors[getKey("3.1.1", false)] = t('alert:Attention') + "! " + t('alert:You are entering a sponsorship that is 125 euros or higher') + ". " 
            + t('alert:Therefore, also complete the form for identification of donors and sponsors') + ".";
        } else if (amount2 && amount2 > 0) {
            extraErrors[getKey("3.1.1", false)] = t('alert:The amount you entered is less than 125 euros, please enter it in the inputfield on the right') + "."
        }

        extraInfo ? enableG104(true) : enableG104(false)

        return extraErrors
    }

    const toggleRadio = (toggleValue) => {
        return (
            () => setCompleteForm(toggleValue)
        )
    }

    const onSubmit = (data) => {
        console.log('data submit')
        console.log(data);
        saveData(data).then(success => {
            console.log("data success: ");
            console.log(success);
            if (success) {
                alert(t('alert:Your data has been saved') + "!");
                dispatch(requestExpensesLoad());
            } else {
                alert(('Error: something went wrong, please try again!'));
            }
        })
    }

    const [expensesTotal, fundsTotal] = getTotals();
    const extraErrors = getExtraErrors();
    const expensesForm = formToHTML({
        data: formInfo.expenses,
        isExpense: true,
        register,
        errors,
        extraErrors,
        translate: t
    });
    const fundsForm = formToHTML({
        data: formInfo.funds,
        isExpense: false,
        register,
        errors,
        extraErrors,
        translate: t
    })

    if (! loaded || ! expensesLoaded) {
        return (
            <Loading />
        )
    }

    if (! userInfo) {
        return (
            <ProfileDoesntExist />
        )
    }

    return (
        <div>
            <A105Head/>
            <div className="vl-grid">
                <p>
                    {t('A105:As a candidate for the elections, did you make any election expenses')}?
                </p>
                <div className="form-group vl-form-col--12-12">
                    <label className="vl-radio">
                        <input
                            className="vl-radio__toggle"
                            type="radio"
                            checked={completeForm}
                            onClick={toggleRadio(true)}
                        />
                        <div className="vl-radio__label">
                            {t('A105:Yes')}
                        </div>
                    </label>
                    <label className="vl-radio">
                        <input
                            className="vl-radio__toggle"
                            type="radio"
                            checked={! completeForm}
                            onClick={toggleRadio(false)}
                        />
                        <div className="vl-radio__label">
                            {t('A105:No')}
                        </div>
                    </label>
                </div>
            </div>
            <div className={completeForm ? "": "vl-u-hidden"}>
                {expensesForm}
                <p className="total-text mb-5">
                    {"Total amount: " + expensesTotal + "€"}
                </p>
                {fundsForm}
                <p className="total-text mb-5">
                    {"Total amount: " + fundsTotal + "€"}
            </p>
            </div>
            <p className="text-bold">
                {t('A105:Submit this form at the latest on ')} {deadlines.forms['a105'].deadline}.
            </p>
            <button 
                className="vl-button mt-5"
                onClick={handleSubmit(onSubmit)} 
            >
                <span className="vl-button__label">
                    {t('A105:Sign and send')}
                </span>
            </button>
        </div>
    )
}