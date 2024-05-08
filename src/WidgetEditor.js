import React, { useMemo } from "react"

const TextBoxIO = React.lazy(() => import("./TextBoxIO"))

function WidgetTextBoxIO({ defaultEmailContent, ...props }) {
    const { uploadURL } = props
    const emailEditorConfig = useMemo(() => {
        return {
            paste: {
                style: "retain",
            },
            css: {
                documentStyles: "",
            },
            ui: {
                toolbar: {
                    items: [
                        // "undo",
                        // {
                        //     label: "Send",
                        //     items: [
                        //         {
                        //             id: "send",
                        //             icon: "/static/assets/admin/layout4/img/send.png",
                        //             text: "Send",
                        //             action() {
                        //                 sendEmail()
                        //             },
                        //         },
                        //     ],
                        // },
                        "emphasis",
                        "style",
                        "align",
                        "listindent",
                        "format",
                        {
                            label: "Insert group",
                            items: [
                                {
                                    id: "insert",
                                    label: "Insert Menu",
                                    items: ["link", "table", "fileupload"],
                                },
                            ],
                        },
                        { label: "tools", items: ["find", "fullscreen"] },
                    ],
                },
            },
            images: {
                upload: {
                    url: uploadURL || `/api/version3/ticket/upload-image-on-editor`, // Handler URL
                    basePath: "/my/application/images/", // Remote image storage path
                    credentials: false, // Optional: sends cookies with the request when true
                },
            },
        }
    }, [uploadURL])

    return <TextBoxIO content={defaultEmailContent} styles={{ height: 350 }} config={emailEditorConfig} {...props} />
}

export default WidgetTextBoxIO
