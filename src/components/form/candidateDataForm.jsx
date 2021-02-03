import React, {useState, useEffect} from "react";
import Loading from '../alert/loading';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';
import { getI18n, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {useSelector} from 'react-redux';
import { useWebId } from '@solid/react';

import {validateLblodID, registerCandidate} from '../../utils/LblodInfo';
import {saveUserInfo, getUserInfo} from '../../utils/userInfo';

export default function CandidateDataForm(props) {

    const {refresh, userInfo} = props;

    const { t } = useTranslation(["form", "alert"]);
    const {register, handleSubmit, setValue, errors} = useForm();
    const webID = useWebId();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [info, setInfo] = useState();

    useEffect(() => {
        console.log("webID");
        if (webID) {
            console.log('loading');
            setLoading(true);
            loadData(webID).then(
                () => setLoading(false)
            );
        }
    }, [webID]);

    useEffect(() => {
        console.log(info);
        if (info) {
            setValue("lblodId", info.lblodId);
            setValue("municipality", info.municipality);
            setValue('postalCode', info.postalCode);
        }
    }, [loading]);

    const loadData = async (webID) =>{
        const info = await getUserInfo(webID);

        if (info) {
            const [success, data] = await validateLblodID(info.lblodId);

            if (success) {
                setName(data);
            }
            setInfo(info);
        }
    }

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

            const registerSuccess = await registerCandidate(
                userInfo.webId, data.lblodId
            )

            if (registerSuccess) {

                const saveSuccess = await saveUserInfo(
                    {
                        lblodId: data.lblodId,
                        municipality: data.municipality,
                        postalCode: data.postalCode 
                    },
                    userInfo.webId   
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

    if (! loading) {
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
                            value={name ? name.firstName : ''}>
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
                            value={name ? name.lastName : ''}/>
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