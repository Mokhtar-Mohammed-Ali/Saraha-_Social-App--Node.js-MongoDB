
import { port } from '../config/config.service.js';
import { globalErrorHandling, sendEmail } from './common/utils/index.js';
import { redisConnection,connectionDB } from './DB/index.js';
import { authRouter, userRouter } from './modules/index.js';
import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

async function bootstrap() {
    const app = express()
    //convert buffer data
    app.use(cors(),express.json())
    // uploads folder static access
    app.use("/uploads", express.static(resolve("../uploads")));
    // DB connection
    await connectionDB()
    await redisConnection()

// // test emsil
// await sendEmail({
//     to: "aboomaraboammar@gmail.com",
//     subject: "Test Email from Saraha App",
//     html: "<p>This is a test email sent from the Saraha app using Nodemailer.</p>",
//     cc:["aboomaraboammar@gmail.com","mokhtarmohammed101@gmail.com"],
    
// })

    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)


    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use(globalErrorHandling)
    // app.use((error, req, res, next) => {
    //     const status = error.cause?.status ?? 500
    //     return res.status(status).json({
    //         error_message:
    //             status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
    //         stack: NODE_ENV == "development" ? error.stack : undefined
    //     })
    // })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap