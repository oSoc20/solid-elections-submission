import React, {useEffect} from "react";
import Loading from '../alert/loading';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import useUserInfo from '../../utils/useUserInfo';

export default function CandidateDataForm(props) {

    const {refresh} = props;

    const { t } = useTranslation(["form", "alert"]);
    const {register, handleSubmit, setValue, errors} = useForm();
    const {loaded, userInfo, saveData} = useUserInfo();

    useEffect(() => {
        if (loaded && userInfo) {
            console.log(userInfo);
            setValue("lblodId", userInfo.lblodId);
            setValue("municipality", userInfo.municipality);
            setValue("postalCode", userInfo.postalCode);
        }
    }, [loaded]);

    const lblodIdPresent = () => {
        return (userInfo && userInfo.lblodId);
    }

    const handleFormSubmit = async function(data) {
        const success = await saveData(data);

        if (success) {
            alert(t('alert:Your data has been saved') + "!");
            refresh();
        } else {
            alert(('Fatal error: something went wrong, please try again!'));
        }
    };

    if (loaded) {
        return (
            <div id="userForm">
                <h1 className="vl-title vl-title--h1 vl-title--has-border">
                    {t('Your information')}:
                </h1>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="vl-grid">
                        <div className="form-group vl-col--12-12">
                             <label className="vl-form__label" htmlFor="lblodid">
                                LBLOD ID:
                            </label>
                            <input
                            type="text" 
                            id="lblodId" 
                            placeholder="http://data.lblod.info/id/personen/xxx" 
                            className="vl-input-field vl-input-field--block" 
                            name="lblodId"
                            ref={register({
                                required: t('This field should be filled in') + "!",
                                pattern: {
                                    value: /https?:\/\/data.lblod.info\/id\/personen\/.+/,
                                    message: t('This should be a valid LBLOD-ID')
                                }
                            })} 
                            readOnly={lblodIdPresent()} />
                            <p className="vl-form__error" id="input-field-lblodId-error">
                                {errors['lblodId'] ? errors['lblodId'].message : null}
                            </p>
                        </div>
                        <div className="form-group vl-form-col--6-12">
                            <label className="vl-form__label" htmlFor="firstname">
                                {t('First name')}:  
                                <FaInfoCircle 
                                data-tip= {t('This field will be auto-completed when entering a valid LBLOD ID') + "."} />
                                </label>
                            <input 
                            type="text" 
                            disabled={true} 
                            id="firstname" 
                            className="vl-input-field vl-input-field--block" 
                            data-type="auto" 
                            name="firstname"
                            value={userInfo ? userInfo.firstName : ''}>
                            </input>
                            <p className="vl-form__error" id="input-field-firstname-error"></p>
                        </div>

                        <div className="form-group vl-form-col--6-12">
                            <label className="vl-form__label" htmlFor="lastname">
                                {t('Last name')}:
                                <FaInfoCircle 
                                data-tip= {t('This field will be auto-completed when entering a valid LBLOD ID') + "."} />
                            </label>
                            <input
                            type="text" 
                            disabled={true} 
                            id="lastname" 
                            className="vl-input-field vl-input-field--block" 
                            data-type="auto" 
                            name="lastname" 
                            value={userInfo ? userInfo.lastName : ''}/>
                            <p className="vl-form__error" id="input-field-lastname-error"></p>
                        </div>

                        <div className="form-group vl-col--12-12--m vl-col--10-12">
                            <label className="vl-form__label" htmlFor="locality">
                                {t('Municipality')}:
                            </label>
                            <input  
                            type="text" 
                            id="municipality" 
                            className="vl-input-field vl-input-field--block" 
                            name="municipality" 
                            ref={register({
                                required: t('This field should be filled in') + "!"
                            })}/>
                            <p className="vl-form__error" id="input-field-municipality-error">
                                {errors["municipality"] ? errors["municipality"].message : null}
                            </p>
                        </div>

                        <div className="form-group vl-col--12-12--m vl-col--2-12">
                            <label className="vl-form__label" htmlFor="postalCode">
                                {t('Postal code')}:
                            </label>
                            <input  
                            type="number" 
                            min="0" 
                            id="postalCode" 
                            className="vl-input-field vl-input-field--block" 
                            name="postalCode"
                            ref={register({
                                required: t('This field should be filled in') + "!",
                                valueAsNumber: true
                            })}/>
                            <p className="vl-form__error" id="input-field-postalCode-error">
                                {errors["postalCode"] ? errors["postalCode"].message : null}
                            </p>
                        </div>
                    </div>

                    <button className="vl-button mt-3">
                        <span className="vl-button__label">{t('Save')}</span>
                    </button>
                </form>
                <ReactTooltip />
            </div>
        );
    } else {
        return (
            <Loading />
        );
    }  
};