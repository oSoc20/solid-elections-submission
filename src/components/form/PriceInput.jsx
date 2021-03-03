import React from 'react'
import { useTranslation } from 'react-i18next'

export default function PriceInput(inputs) {

    const {id, label, help} = inputs;
    const {errors, extraErrors} = inputs;
    const {register} = inputs;

    const { t } = useTranslation(["A105", "alert"]);

    return (
        <div className="form-group vl-form-col--6-12">
            {label && 
                <label className="vl-form__label">
                    {label}
                    {" "}
                    {help}
                </label>
            }
            <div className="vl-input-group">
                <button className="vl-button vl-button--icon">
                    <span style={{"margin": "0px auto"}}>€</span>
                </button>
                <input
                    defaultValue={0}
                    type="number"
                    name={id}
                    className="vl-input-field vl-input-field--block"
                    ref={register({
                        min: {
                            value: 0,
                            message: t("alert:The filled in amount should be greater than zero") + "!"
                        },
                        valueAsNumber: true
                    })}
                />
            </div>
            <p className="vl-form__error">
                {
                    (errors[id] &&  errors[id].message) || 
                    (extraErrors[id] && extraErrors[id])
                }
            </p>
        </div>
    )
}