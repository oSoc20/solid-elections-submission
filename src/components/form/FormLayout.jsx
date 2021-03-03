import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import useUserInfo from "../../utils/useUserInfo";

import A105 from "./A105";

export default function FormLayout(props) {

    const { t } = useTranslation(["form"]);
    const {loaded, userInfo} = useUserInfo();
    const [g104, enableG104] = useState(false);

    return (
        <div>
            <ul id="formSelection" className="nav nav-tabs nav-fill" role="tablist">
                <li className="nav-item">
                    <a 
                    id="tab-a105" 
                    className="nav-link active" 
                    data-toggle="tab" 
                    href="#a105-form" 
                    role="tab" 
                    aria-controls="a105-form" 
                    aria-selected="false">
                        {t('form:Expenditure candidate')}
                    </a>
                </li>
                <li className={"nav-item " + (userInfo != null && userInfo.lists[0].position == 1 ? "" : "disabled")}>
                    <a 
                    id="tab-g103" 
                    className={"nav-link " + (userInfo != null && userInfo.lists[0].position == 1 ? "" : "disabled")} 
                    data-toggle="tab" 
                    href="#g103-form" 
                    role="tab" 
                    aria-controls="g103-form" 
                    aria-selected="true">
                        {t('form:Expenditure list')}
                    </a>
                </li>
                <li className="nav-item disabled">
                    <a 
                    id="tab-g104" 
                    className={"nav-link" + (g104 ? "" : " disabled")}
                    data-toggle="tab" 
                    href="#g104-form" 
                    role="tab" 
                    aria-controls="g104-form" 
                    aria-selected="false">
                        {t('form:Donors/sponsors candidate')}
                    </a>
                </li>
                <li className="nav-item disabled">
                    <a 
                    id="tab-a106" 
                    className="nav-link disabled" 
                    data-toggle="tab" 
                    href="#a106-form" 
                    role="tab" 
                    aria-controls="a106-form" 
                    aria-selected="false">
                        {t('form:Donors/sponsors list')}
                    </a>
                </li>
                <li className={"nav-item " + (userInfo != null && userInfo.mandated > 0 ? "" : "disabled")}>
                    <a 
                    id="tab-extra" 
                    className={"nav-link " + (userInfo != null && userInfo.mandated > 0 ? "" : "disabled")} 
                    data-toggle="tab" 
                    href="#extra-form" 
                    role="tab" 
                    aria-controls="extra-form" 
                    aria-selected="false">
                        {t('form:Expenditure political party')}
                    </a>
                </li>
            </ul>

            <div className="tab-content" id="tabContent">
                <div className="tab-pane fade show active" id="a105-form" role="tabpanel" aria-labelledby="a105-form">
                    <A105 enableG104={enableG104}/>
                </div>
                <div className="tab-pane fade" id="g103-form" role="tabpanel" aria-labelledby="g103-form">
                    <h1>U ziet dit formulier omdat u lijsttrekker bent.</h1>
                    <p>Het maximumbedrag dat u als lijst mag uitgeven bedraagt {userInfo != null ? userInfo.listAmount : ""}€</p>
                </div>
                <div className="tab-pane fade" id="g104-form" role="tabpanel" aria-labelledby="g104-form">
                    <h1>Form G104</h1>
                </div>
                <div className="tab-pane fade" id="a106-form" role="tabpanel" aria-labelledby="a106-form">
                    <h1>Form A106</h1>
                </div>
                <div className="tab-pane fade" id="extra-form" role="tabpanel" aria-labelledby="extra-form">
                    <p>U ziet dit formulier omdat u gemandateerde bent vanuit uw partij.</p>
                </div>
            </div>
        </div>
    );
}