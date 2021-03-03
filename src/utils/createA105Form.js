import React from 'react'

import PriceInput from '../components/form/PriceInput'
import Help from "../components/alert/help"

export const formToHTML = (inputs) => {
    const {data} = inputs
    const {translate} = inputs

    if (! data) throw "NO DATA PROVIDED!"

    return (
        <div>
            <h2 className="vl-title vl-title--h2 vl-title--has-border">
                {translate ? translate("A105:" + data.title) : data.title}
                {" "}
                {data.help ? helpToHTML({data: data.help, translate: translate}) : ""}
            </h2>
            {
                data.sections ? 
                data.sections.map(
                    sectionData => {
                        const sectionInputs = {
                            ...inputs,
                            data: sectionData
                        }
                        return sectionToHTML(sectionInputs)
                    }
                ) :
                ""
            } 
        </div>
    )
}

const sectionToHTML = (inputs) => {
    const {data, isExpense, register, errors, extraErrors} = inputs
    const {translate} = inputs

    if (! data) throw "NO DATA PROVIDED!"

    return (
        <div>
            <h3 className="vl-title vl-title--h3 vl-title--has-border">
                {translate ? translate("A105:" + data.title) : data.title}
                {" "}
                {data.help ? helpToHTML({data: data.help, translate: translate}) : ""}
            </h3>
            <div className="vl-grid">
                {
                    data.subsections ?
                    data.subsections.map(
                        subData => {
                            const subInputs = {
                                ...inputs,
                                data: subData
                            }
                            return subsectionToHTML(subInputs)
                        }
                    ) :
                    <PriceInput
                        id={getKey(data.key, isExpense)}
                        register={register}
                        errors={errors}
                        extraErrors={extraErrors}
                    />
                }
            </div>
        </div>
    )
}

const subsectionToHTML = (inputs) => {
    const {data, isExpense, register, errors, extraErrors} = inputs
    const {translate} = inputs

    if (! data) throw "NO DATA PROVIDED"

    return (
        <PriceInput
            label={translate ? translate("A105:" + data.title) : data.title}
            id={getKey(data.key, isExpense)}
            register={register}
            errors={errors}
            extraErrors={extraErrors}
            help={data.help ? helpToHTML({data: data.help, translate: translate}) : null}
        />
    )
}

const helpToHTML = (inputs) => {
    const {data} = inputs
    if (! data) return null

    const {paragraphs} = data
    if (! paragraphs) return null

    return (
        <Help message={
            paragraphs.map(
                paragraph => paragraphToHTML({...inputs, data: paragraph})
            )
        }/>
    )
}

const paragraphToHTML = (inputs) => {
    const {data, translate} = inputs
    if (! data) return null

    const {sentences, listElements} = data

    if (sentences) {
        const translateSentence = (sentence) => {
            return translate ? translate("alert:" + sentence) : sentence
        }
        return (
            <p className="vl-u-spacer">
                {
                    sentences.reduce(
                        (acc, curr) => acc + " " + translateSentence(curr.sentence) + curr.connector, ""
                    )
                }
            </p>
        )
    }

    if (listElements) {
        const translateElement = (element) => {
            return translate ? translate("alert:" + element) : element
        }
        return (
            <ul className="vl-link-list">
                {listElements.map(
                    listElement => {
                        return (
                            <li class="vl-link-list__item">
                                {"- "}
                                {translateElement(listElement.content)}
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }

    return null
}

export const getKey = (key, isExpense) => {
    if (isExpense) {
        return "E".concat(key.replaceAll(".", "-"));
    } else{
        return "F".concat(key.replaceAll(".", "-"))
    }
}