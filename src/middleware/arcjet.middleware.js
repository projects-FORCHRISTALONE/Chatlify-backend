// BY GOD'S GRACE ALONE
    import aj from "../lib/arcjet.js";
    import { isSpoofedBot } from "@arcjet/inspect";

    export const arcjetProtection = async (req,res,next) => {
        try{
            const decision = await aj.protect(req);

            if(decision.isDenied()){
                if (decision.reason.isRateLimit()){
                    return res.status(429).json({message:"Rate limit exceeded. Please try again later."})
                }
                else if (decision.reason.isBot()){
                    // return res.status(403).send({message: "Bot access denied"})
                } else {
                    return res.status(403).send({message: "Access denied by security policy"})
                }
            };

            if (decision.results.some(isSpoofedBot)){
                return res.status(403).json({
                    error: "Spoofed Bot detected",
                    message: "Malicious bot activity detected"
                })
            };

            next();


        }catch(err){
            console.log("Arcjet Protection Error:", err)
            next()
        }
    }