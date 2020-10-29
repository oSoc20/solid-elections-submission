import { useState } from "react";
import {isEmpty, isNumber, isOnlyText} from './DataValidator';

const useExpensesForm =  () => {

    const [expensesValues, setExpensesValues] = useState({
        EAuditoryAndOral: 0,
        EWrittenMessage1_1: 0,
        EWrittenMessage1_2: 0,
        EWrittenMessage2: 0,
        EWrittenMessage3: 0,
        EWrittenMessage4: 0,
        EWrittenMessage5: 0,
        EShippingAndDistribution1_1: 0,
        EShippingAndDistribution1_2: 0,
        EShippingAndDistribution2: 0,
        EShippingAndDistribution3: 0,
        EVisualMessage1: 0,
        EVisualMessage2: 0,
        EVisualMessage3: 0,
        EVisualMessage4: 0,
        EOtherCost1: 0,
        EOtherCost2: 0,
        EOtherCost3: 0
    })

    const [total, setTotal] = useState(0);

    const handleExpensesChange = (event) => {
        const {id, value} = event.target;
        validateChange(id, value);
        
        const oldValue = expensesValues[id];
        const parsedValue = parseFloat(value);

        setExpensesValues({
            ...expensesValues,
            [id]: parsedValue
        });
        updateTotal(oldValue, parsedValue);
    }

    const validateChange = (id, value) => {
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
        handleExpensesChange, expensesValues, total
    });
}

export default useExpensesForm;