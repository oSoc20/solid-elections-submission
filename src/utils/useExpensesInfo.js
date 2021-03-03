import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import { getExpensesInfo, saveA105Data } from './expensesInfo'
import { setExpensesInfo } from '../actions/expensesInfo'
import formInfo from '../data/a105.json'

const useExpensesInfo = () => {

    const {loaded, info} = useSelector(state => state.expensesInfo);
    const userInfoObject = useSelector(state => state.userInfo);
    const webID = useSelector(state => state.webID);
    const dispatch = useDispatch();

    useEffect(() => {
        if (! loaded) {
            loadData(webID);
        }
    }, [loaded]);

    const loadData = async (webID) => {
        console.log('loading data');
        const data = await getExpensesInfo(webID);
        console.log(data);

        if (! data) {
            // TODO: handle load fail
            return 
        }

        dispatch(setExpensesInfo(data));
    }

    const saveData = async (data) => {
        console.log('saving data');

        const userLoaded = userInfoObject.loaded;
        const userInfo = userInfoObject.info;

        if (!(userLoaded && userInfo && userInfo.subject)) {
            return false;
        }

        const actions = []
        for (const rawKey in data) {
            const isExpense = rawKey[0] == "E";
            const key = rawKey.slice(1).replaceAll("-", ".")
            actions.push({
                isExpense: isExpense,
                identifier: key,
                price: data[rawKey],
                description: getInfo(key, isExpense ? formInfo.expenses : formInfo.funds),
                priceCurrency: 'EUR'
            });
        }

        const saveSuccess = await saveA105Data(webID, userInfo.subject, actions);

        return saveSuccess;
    }

    const getInfo = (key, info) => {
        if (info.key && key == info.key) {
            return info.title;
        }

        if (info.sections) {
            const mappedSections = info.sections.map(
                section => getInfo(key, section)
            )
            const filtered = mappedSections.filter(
                sectionResponse => sectionResponse
            )
            if (filtered.length > 0) {
                return filtered[0]
            }
            return null
        }

        if (info.subsections) {
            const mappedSections = info.subsections.map(
                subsection => getInfo(key, subsection)
            )
            const filtered = mappedSections.filter(
                sectionResponse => sectionResponse
            )

            if (filtered.length > 0) {
                return info.title + " - " + filtered[0]
            }
            return null
        }

        return null
    }

    return {
        expensesLoaded: loaded,
        expensesInfo: info,
        saveData
    }
}

export default useExpensesInfo;