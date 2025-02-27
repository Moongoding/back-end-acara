import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utills/database";


async function init() {
    try {
        const result = await db();
        console.log("Database status:", result);

        const app = express();
        app.use(bodyParser.json())

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is Running",
                data: null,
            })
        });


        const PORT = 3000
        app.use('/api', router);
        app.listen(PORT, () => {
            console.log(`Server is Running on http://localhost:${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}
init();