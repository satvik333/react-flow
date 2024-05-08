/* eslint-disable react/no-find-dom-node */
import React, { PureComponent } from "react"
import { findDOMNode } from "react-dom"
// import "./textboxio/TextboxIO.custom.css"
import PropTypes from "prop-types"
// import { loadGoogleTransliterate, setGoogleTransliterateLanguagePair, setGoogleTransliterateStatus } from "app/main/utilities/general.functions"
// import { transliterateLangs, BASE_URL } from "./store/constants"


// import { loadTextBoxIO } from "./textboxio/index"
// import FileUploadService from "app/services/fileUploadService/fileUpload.service"

const BASE_URL = ""

const defaultConfig = {
    // basePath: `${process.env.PUBLIC_URL}/static/js/textboxio/`,
    ui: {
        locale: "en",
        toolbar: {
            items: [{ label: "Undo and Redo", items: ["undo", "redo"] }],
        },
    },
    codeview: {
        enabled: false,
        showButton: false,
    },
}

const style = { width: "100%", height: 400 }

// const availableLangs = { None: "", ...transliterateLangs }
const availableLangs = { None:"", English: 'english'}

/**
 * TextboxIO
 * @param {string} uid
 * @param {string} content It should a default text which should be set in the editor
 * @param {callbackFn} getInstance Get the editor instance
 *
 */
class TextboxIO extends PureComponent {
    static propTypes = {
        isTransliterateEnabled: PropTypes.bool,
        config: PropTypes.object,
        onLoad: PropTypes.func,
        onContentChange: PropTypes.func,
        styles: PropTypes.object,
        content: PropTypes.string,
    }

    static defaultProps = {
        isTransliterateEnabled: false,
        config: null,
        onLoad: null,
        onContentChange: null,
        styles: null,
        content: "",
    }

    refEditor

    onChangeListener

    textboxio

    constructor(props) {
        super(props)

        this.state = {
            transliterateLang: "hi",
            isTransliterate: false,
        }

        if (!window.textboxio) {
            // loadTextBoxIO(this.ensureEditor)
        }
    }

    componentDidMount() {
        this.ensureEditor()
        // this.initGoogleTransliterate()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content || prevProps.uid !== this.props.uid) {
            this.ensureEditor()
        }
    }

    componentWillUnmount() {
        // const [editor] = textboxio.get(`#textboxio-editor-${String(this.props.uid)}`)
        const control = findDOMNode(this.refEditor)

        if (!this.textboxio) return

        const editors = this.textboxio.get(`#${control?.getAttribute("id")}`)
        if (editors.length > 0) {
            editors[0].restore()
            editors[0].events.dirty.removeListener(this.onChangeListener)
            editors[0].events.loaded.removeListener(this.onLoadListener)
        }

        clearTimeout(this.delayedLoadGTransliterate)
    }

    // initGoogleTransliterate = () => {
    //     const { isTransliterate } = this.state
    //     const { uid, isTransliterateEnabled } = this.props

    //     if (!isTransliterateEnabled && (!isTransliterate || this.transliterateInstance)) {
    //         return false
    //     }

    //     const transliterateOptions = {
    //         transliterationEnabled: isTransliterate,
    //     }

    //     const tbioEditor = document.querySelector(`#ephox_textboxio-editor-${uid} .ephox-hare-content-iframe`)

    //     loadGoogleTransliterate([tbioEditor], transliterateOptions)
    //         .then(instance => {
    //             const { transliterateLang } = this.state
    //             this.transliterateInstance = instance
    //             if (isTransliterate) {
    //                 setGoogleTransliterateStatus(this.transliterateInstance, "enable")
    //                 setGoogleTransliterateLanguagePair(this.transliterateInstance, "en", transliterateLang)
    //             }
    //         })
    //         .catch(er => {
    //             console.error("TextboxIO::initGoogleTransliterate", er)
    //             clearTimeout(this.delayedLoadGTransliterate)
    //             this.delayedLoadGTransliterate = setTimeout(() => {
    //                 this.initGoogleTransliterate()
    //             }, 1000)
    //         })
    // }

    updateTransliterate = lang => {
        if (lang === "") {
            // setGoogleTransliterateStatus(this.transliterateInstance, "disable")
        } else {
            this.setState(
                {
                    isTransliterate: true,
                    transliterateLang: lang,
                },
                // () => {
                //     this.initGoogleTransliterate()
                //     // setGoogleTransliterateStatus(this.transliterateInstance, "enable")
                //     // setGoogleTransliterateLanguagePair(this.transliterateInstance, "en", lang)
                // }
            )
        }
    }

    getCustomTBConfig = () => {
        try {
            const config = { ...defaultConfig, ...this.props?.config }

            // All custom toolbars and configs.
            const transliterateMenuItems = Object.keys(availableLangs || {}).map(lang => ({
                id: lang,
                text: lang,
                icon: `${BASE_URL}/static/icons/translate.png`,
                action: () => {
                    this.updateTransliterate(availableLangs[lang])
                },
            }))

            const otherGroupMenu = [
                {
                    id: "clear_content",
                    label: "Clear",
                    icon: `${BASE_URL}/static/icons/edit_clear.png`,
                    text: "Clear",
                    action: () => {
                        this.resetContent()
                    },
                },
                { id: "transliterate", icon: `${BASE_URL}/static/icons/translate.png`, label: "transliterate menu", items: [...transliterateMenuItems] },
            ]

            return {
                ...config,
                ui: {
                    ...config.ui,
                    toolbar: {
                        ...config.ui.toolbar,
                        items: [...config.ui.toolbar.items, { label: "Other Group", icon: `${BASE_URL}/static/icons/translate.png`, items: otherGroupMenu }],
                    },
                },
                images: {
                    upload: {
                        handler: this.uploadImages,
                    },
                },
            }
        } catch (er) {
            console.error("TextBoxIO::getCustomTBConfig-Error", er)
            return defaultConfig
        }
    }

    initTextboxIo = (elId, props) => {
        if (!this.textboxio || !elId) return

        const config = {
            ...this.getCustomTBConfig(),
        }

        // console.log(config)

        const editorInstance = this.textboxio.replace(`#${elId}`, config)
        editorInstance.content.set(props.content || "")

        // Pass editor instance.
        if (typeof this.props.getInstance === "function") {
            this.props.getInstance(editorInstance)
        }

        this.onChangeListener = editorInstance.events.dirty.addListener(() => {
            // console.log("Content is changed", editorInstance.content.get())
            this.saveContent()
        })

        this.onLoadListener = editorInstance.events.loaded.addListener(() => {
            if (!this.props?.skipFocusOnLoad) {
                editorInstance.focus()
            }
            if (typeof this.props.onLoad === "function") {
                this.props.onLoad()
            }
        })
    }

    setAttributeForIframe = () => {
        try {
            const tbioIframe = document.querySelector(`#ephox_textboxio-editor-${String(this.props.uid)} .ephox-hare-content-iframe`)
            tbioIframe.setAttribute("designMode", "on")
        } catch {
            console.log("Error in setAttributeForIframe")
        }
    }

    ensureEditor = () => {
        this.textboxio = window.textboxio

        if (!this.textboxio) return

        const control = findDOMNode(this.refEditor)
        const editors = this.textboxio.get(`#${control?.getAttribute("id")}`)

        if (editors.length === 0) {
            // console.log("ensureEditor updated")
            this.initTextboxIo(control?.getAttribute("id"), this.props)
        } else {
            // Update the content
            editors[0].content.set(this.props.content)

            if (this.props.content === "reset") {
                this.resetContent()
            }
        }
    }

    saveContent = () => {
        if (!this.textboxio) return

        const control = findDOMNode(this.refEditor)
        const editors = this.textboxio.get(`#${control?.getAttribute("id")}`)

        if (editors.length > 0) {
            // console.log("Content changeedddd", editors[0].content.get())
            if (this.props.onContentChange) {
                this.props.onContentChange(editors[0].content.get())
            }
            // set attributes to iframe and div for transliterate.
            if (this.props.isTransliterateEnabled) this.setAttributeForIframe()
            editors[0].content.setDirty(false)
        }
    }

    resetContent = () => {
        if (!this.textboxio) return

        const control = findDOMNode(this.refEditor)
        const editors = this.textboxio.get(`#${control?.getAttribute("id")}`)
        editors[0].content.set("")
    }

    /**
     *
     *
     * @param {{blob: ()=> Blob, base64: ()=> Base64, filename: ()=> string, id: ()=> string}} data
     * @param {(url: URL)=>} resolve
     * @param {(message?: String)=>} reject
     * @memberof TextboxIO
     */
    uploadImages = async (data, resolve, reject) => {
        // const fileResponse = await new FileUploadService([data.blob()], "textbox-io").uploadFile()

        // if (fileResponse?.status !== "success") {
        //     reject(fileResponse.errorMessage)
        // } else if (fileResponse?.files && Array.isArray(fileResponse.files)) {
        //     resolve(fileResponse.files[0].url)
        // }
    }

    render() {
        return (
            <div>
                <form>
                    <textarea
                        ref={ref => {
                            this.refEditor = ref
                        }}
                        placeholder="Enter..."
                        className="textboxio-wrapper"
                        id={`textboxio-editor-${String(this.props.uid)}`}
                        style={this.props.styles ? this.props.styles : style}
                    />
                </form>
            </div>
        )
    }
}

export default TextboxIO
