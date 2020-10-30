import { useState } from "react";
import {isEmpty, isOnlyText} from './DataValidator';
import { createExpense } from "./SolidWrapper";

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

    const [expensesTotal, setTotal] = useState(0);

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

    const expensesInfo = {
        EAuditoryAndOral: { 
            key: '1.1', 
            description: 'Auditory and oral messages'
        },
        EWrittenMessage1_1: { 
            key: '2.1.1', 
            description: 'Written messages - Design and production costs in the press'
        },
        EWrittenMessage1_2: { 
            key: '2.1.2', 
            description: 'Written messages - Price for the advertising space in the press'
        },
        EWrittenMessage2: { 
            key: '2.2', 
            description: 'Written messages - Design and production costs of election brochures'
        },
        EWrittenMessage3: { 
            key: '2.3', 
            description: 'Written messages - Cost of letters and envelopes'
        },
        EWrittenMessage4: { 
            key: '2.4', 
            description: 'Written messages - Cost of other printed matter'
        },
        EWrittenMessage5: { 
            key: '2.5', 
            description: 'Written messages - Costs for e-mails and non-commercial SMS campaigns'
        },
        EShippingAndDistribution1_1: { 
            key: '3.1.1', 
            description: 'Shipping and distribution - Addressed shipments in election printing'
        },
        EShippingAndDistribution1_2: { 
            key: '3.1.2', 
            description: 'Shipping and distribution - Non-addressed shipments in election printing'
        },
        EShippingAndDistribution2: { 
            key: '3.2', 
            description: 'Shipping and distribution - Other costs of distribution'
        },
        EShippingAndDistribution3: { 
            key: '3.3', 
            description: 'Shipping and distribution - Costs for e-mails and non-commercial SMS campaigns'
        },
        EVisualMessage1: { 
            key: '4.1', 
            description: 'Visual messages - A production and rental costs for non-commercial signs of 4 m² or less'
        },
        EVisualMessage2: { 
            key: '4.2', 
            description: 'Visual messages - Printing and production costs for posters of 4 m² or less'
        },
        EVisualMessage3: { 
            key: '4.3', 
            description: 'Visual messages - Internet commercials or internet campaigns'
        },
        EVisualMessage4: { 
            key: '4.4', 
            description: 'Visual messages - Other costs for visual messages'
        },
        EOtherCost1: { 
            key: '5.1', 
            description: 'Other costs - Election manifestations'
        },
        EOtherCost2: { 
            key: '5.2', 
            description: 'Other costs - Production costs for website or webpage designed for election purposes'
        },
        EOtherCost3: { 
            key: '5.3', 
            description: 'Other costs - Varia'
        }
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
        setTotal(expensesTotal - oldValue + newValue);
    }

    const handleExpensesSubmit = (doc, userProfile, dataToSave) => {
        let error = false;
        for (const [key, value] of Object.entries(expensesValues)) {
            if (error) {
                alert('Geen gedeclareerde uitgaven!');
                return false;
            }
            error = isEmpty(value);
        }

        let buyActionData;

        for (const [id, value] of Object.entries(expensesValues)) {

            buyActionData = {
                identifier: expensesInfo[id].key,
                description: expensesInfo[id].description,
                price: value,
                priceCurrency: 'EUR'
            }
            
            dataToSave.push(createExpense(doc, userProfile, buyActionData));
        }

        return true;
    }

    return ({
        handleExpensesChange, handleExpensesSubmit, expensesValues, expensesTotal
    });
}

export default useExpensesForm;