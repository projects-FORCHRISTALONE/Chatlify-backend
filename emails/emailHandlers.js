// BY GOD'S GRACE ALONE

import { resendClient, sender } from "../src/lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"


export const sendWelcomeEmail = async (email, name, clientUrl) => {
    const {data, error} = await resendClient.emails.send({
        from : `${sender.name} <${sender.email}>`,
        to : email,
        subject: "Welcome to Chatify",
        html: createWelcomeEmailTemplate(name, clientUrl)
    })

    if (error){
        console.error("Error sending welcome email:", error)
        throw new Error("Failed to send welcome email")
    }

    console.log("Welcome Email sent successfully", data)
}