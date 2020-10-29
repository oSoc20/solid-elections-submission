import { useState, useEffect } from "react";
import {isEmpty, isNumber, isOnlyText} from './DataValidator';
import { useTranslation } from 'react-i18next';

const useFundsForm =  () => {

    const { t } = useTranslation(["alert"]);

    const [fundsValues, setFundsValues] = useState({
        FSection1: 0,
        FSection2_1: 0,
        FSection2_2: 0,
        FSection3_1: 0,
        FSection3_2: 0,
        FSection4: 0,
        FSection5: 0
    })

    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (fundsValues.FSection2_1 >= 125 ||
            fundsValues.FSection3_1 >= 125) {
                console.log("Enabling!");
                document.getElementById("tab-g104").classList.remove("disabled");
                document.getElementById("tab-g104").parentElement.classList.remove("disabled");
            } else {
                console.log("Disabling!");
                document.getElementById("tab-g104").classList.add("disabled");
                document.getElementById("tab-g104").parentElement.classList.add("disabled");
            }
    }, [fundsValues.FSection2_1, fundsValues.FSection3_1])

    const handleFundsChange = (event) => {
        const {id, value} = event.target;
        const minValidation = 
            event.target.getAttribute("data-min") == "125";
        validateChange(id, value, minValidation);
        
        const oldValue = fundsValues[id];
        const parsedValue = parseFloat(value);

        console.log(parsedValue);

        setFundsValues({
            ...fundsValues,
            [id]: parsedValue
        });
        updateTotal(oldValue, parsedValue);
    }

    const validateChange = (id, value, minValidation) => {
        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (isEmpty(value)) {
                input.classList.add("vl-input-field--error");
                if (input.type === 'number') {
                    errorField.innerHTML = "Dit veld moet met een nummer gevult worden!";
                } else {
                    errorField.innerHTML = "Dit veld moet gevult worden!";
                }
                return true;
            } else {
                if (input.type !== 'number') {
                    if (!isOnlyText(value)) {
                        errorField.innerHTML = "This field must be text!";
                        input.classList.add("vl-input-field--error");

                        return true;
                    }
                }
            }
            errorField.innerHTML = "";
            input.classList.remove("vl-input-field--error");
        }

        let section = document.getElementById("input-field-" + id + "-error");
        if (minValidation) {
            if (value >= 125) {
                section.innerHTML = t('alert:Attention') + "! " + t('alert:You are entering a sponsorship that is 125 euros or higher') + ". " 
                + t('alert:Therefore, also complete the form for identification of donors and sponsors') + ".";
            } else {
                //Condition there because no error if it's 0 but we have to remove the tab if necessary
                if (value > 0) {
                    section.innerHTML = t('alert:The amount you entered is less than 125 euros, please enter it in the inputfield on the right') + ".";
                }
            }
        }

        return false;
    }

    const updateTotal = (oldValue, newValue) => {
        if (isNaN(oldValue)) {
            oldValue = 0;
        }
        if (isNaN(newValue)) {
            newValue = 0;
        }
        setTotal(total - oldValue + newValue);
    }

    return ({
        handleFundsChange, fundsValues, total
    });
}

export default useFundsForm;