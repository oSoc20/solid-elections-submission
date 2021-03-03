import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { getUserInfo, saveUserInfo } from './userInfo';
import { fetchLBLODInfo, registerCandidate, validateLblodID } from './LblodInfo';
import {setUserInfo} from '../actions/userInfo';

const useUserInfo = () => {

    const {loaded, info} = useSelector(state => state.userInfo)
    const webID = useSelector(state => state.webID);
    const dispatch = useDispatch();

    useEffect(() => {
        if (! loaded) {
            loadData(webID);
        }
    }, [loaded]);

    const loadData = async (webID) => {
        //fetch data from solid pod
        const solidData = await getUserInfo(webID);
        if (! solidData) {
            //TODO: handle fail
            return
        }

        //fetch firstname and lastname from lblod database
        //  this will fail when invalid lblodID is saved on solid pod
        const [success, lblodData] = await validateLblodID(solidData.lblodId);
        if (! success) {
            //TODO: handle fail
            return
        }

        //fetch extra information from lblod database
        const [extraSuccess, extraData] = await fetchLBLODInfo(solidData.lblodId);
        if (! extraSuccess) {
            //TODO: handle fail
            return
        }

        const userInfo = {
            ...solidData,
            ...lblodData,
            ...extraData
        }
        dispatch(setUserInfo(userInfo));
    }

    const saveData = async (data) => {
        const [validID, _] = await validateLblodID(data.lblodId);

        if (! validID) {
            return false;
        }

        const registerSuccess = await registerCandidate(
            webID, data.lblodId
        );

        if (! registerSuccess) {
            return false;
        }

        const saveSuccess = await saveUserInfo(data, webID);

        if (! saveSuccess) {
            return false;
        }
        return true;
    }

    return {
        loaded,
        userInfo: info,
        saveData
    }
}

export default useUserInfo;