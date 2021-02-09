import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { getUserInfo, saveUserInfo } from './userInfo';
import { registerCandidate, validateLblodID } from './LblodInfo';
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
        const solidData = await getUserInfo(webID);

        if (solidData) {
            const [success, lblodData] = await validateLblodID(solidData.lblodId);

            if (success) {
                const userInfo = {
                    ...solidData,
                    ...lblodData
                }

                dispatch(setUserInfo(userInfo));
            }
        }
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