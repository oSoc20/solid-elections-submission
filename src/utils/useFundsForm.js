import { useState, useEffect } from "react";
import {isEmpty, isOnlyText} from './DataValidator';
import { useTranslation } from 'react-i18next';
import { createDonation } from "./SolidWrapper";

const useFundsForm =  () => {

    const { t } = useTranslation(["alert", "form"]);

    const [fundsValues, setFundsValues] = useState({
        FSection1: 0,
        FSection2_1: 0,
        FSection2_2: 0,
        FSection3_1: 0,
        FSection3_2: 0,
        FSection4: 0,
        FSection5: 0
    })

    const [fundsTotal, setTotal] = useState(0);

    useEffect(() => {
        if (fundsValues.FSection2_1 >= 125 ||
            fundsValues.FSection3_1 >= 125) {
                document.getElementById("tab-g104").classList.remove("disabled");
                document.getElementById("tab-g104").parentElement.classList.remove("disabled");
            } else {
                document.getElementById("tab-g104").classList.add("disabled");
                document.getElementById("tab-g104").parentElement.classList.add("disabled");
            }
    }, [fundsValues.FSection2_1, fundsValues.FSection3_1])

    const fundsInfo = {
        FSection1: { 
            key: '1.1', 
            description: 'Funds deriving from the list\'s own patrimony'
        },
        FSection2_1: { 
            key: '2.1.1', 
            description: 'Donations of EUR 125 or more per donor'
        },
        FSection2_2: { 
            key: '2.1.2', 
            description: 'Donations of less than €125 per donor' 
        },
        FSection3_1: { 
            key: '3.1.1', 
            description: 'Sponsorship of EUR 125 or more per sponsor'
        },
        FSection3_2: { 
            key: '3.1.2', 
            description: 'Sponsorship of less than EUR 125 per sponsor'
        },
        FSection4: { 
            key: '4.1', 
            description: 'Financing by (a component of) the political party' 
        },
        FSection5: { 
            key: '5.1', 
            description: 'Other source'
        }
    }

    const handleFundsChange = (event) => {
        const {id, value} = event.target;
        const minValidation = 
            event.target.getAttribute("data-min") == "125";
        validateChange(id, value, minValidation);
        
        const oldValue = fundsValues[id];
        const parsedValue = parseFloat(value);

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
                    errorField.innerHTML = t('form:This field can only contain numbers') + "!";
                } else {
                    errorField.innerHTML = t('from:This field should be filled in') + "!";
                }
                return true;
            } else {
                if (input.type !== 'number') {
                    if (!isOnlyText(value)) {
                        errorField.innerHTML = t('form:This field can only contain text') + "!";
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
        setTotal(fundsTotal - oldValue + newValue);
    }

    const handleFundsSubmit = (doc, userProfile, dataToSave) => {
        let error = false;
        for (const [key, value] of Object.entries(fundsValues)) {
            if (error) {
                alert('Geen gedeclareerde uitgaven!');
                return false;
            }
            error = isEmpty(value);
        }

        let buyActionData;

        for (const [id, value] of Object.entries(fundsValues)) {

            buyActionData = {
                identifier: fundsInfo[id].key,
                description: fundsInfo[id].description,
                price: value,
                priceCurrency: 'EUR'
            }
            
            dataToSave.push(createDonation(doc, userProfile, buyActionData));
        }

        return true;
    }

    return ({
        handleFundsChange, handleFundsSubmit, fundsValues, fundsTotal
    });
}

export default useFundsForm;