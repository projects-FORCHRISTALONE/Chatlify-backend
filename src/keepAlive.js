// BY GOD'S GRACE ALONE

import cron from "node-cron"

const SERVER_URL = "https://chatlify-backend-5v32.onrender.com/"

cron.schedule("*/10 * * * *", async () => {
    try{
        const res = await fetch(SERVER_URL)
    } catch(error){
        console.log("Ping failed: ", error.message)
    }
})