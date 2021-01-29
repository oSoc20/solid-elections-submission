import React, {useState, useEffect} from "react";
import Loading from '../alert/loading';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import {validateLblodID, registerCandidate} from '../../utils/LblodInfo';
import {saveUserData} from '../../utils/SolidWrapper'

export default function CandidateDataForm(props) {

    const FILE_NAME = "me.ttl";

    const {loaded, refresh, userInfo} = props;

    const { t } = useTranslation(["form", "alert"]);
    const {register, handleSubmit, setValue, errors} = useForm();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        if (userInfo) {
            setValue("lblodId", userInfo.personUri);
            setValue("municipality", userInfo.address.municipality);
            setValue('postalCode', userInfo.address.postalCode);

            setFirstName(userInfo.name);
            setLastName(userInfo.familyName);
        }
    }, [loaded]);

    const lblodIdPresent = () => {
        if (userInfo && userInfo.personUri) {
            return true
        }

        return false;
    }

    const handleFormSubmit = async function(data) {

        console.log(data);

        const [validLblodID, nameData] = await validateLblodID(data.lblodId);

        if (validLblodID) {
            setFirstName(nameData.firstName);
            setLastName(nameData.lastName);

            const registerSuccess = await registerCandidate(
                userInfo.webId, data.lblodId
            )

            if (registerSuccess) {
                const saveSuccess = await saveUserData(
                    userInfo.appContainer,
                    FILE_NAME,
                    {
                        lblodId: data.lblodId,
                        municipality: data.municipality,
                        postalCode: data.postalCode
                    }
                )

                if (saveSuccess) {
                    alert(t('alert:Your data has been saved') + "!");
                    refresh();

                    return true;
                }
            }
            alert(('Fatal error: something went wrong, please try again!'));
            return false;
        }
        alert("Fatal error: This LBLOD ID doesn't exist!");
        return false;
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
                            value={firstName}>
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
                            value={lastName}/>
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
            //Show when appContainer is still null or undefined (use in init() from componentDidMount() and componentDidUpdate())
            //We need the appContainer to fetch data from the solid pod or API
            <Loading />
        );
    }  
};