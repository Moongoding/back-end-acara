import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utills/database";
import docs from "./docs/route";
import cors from "cors";


async function init() {
    try {
        const result = await db();
        const PORT = 3000
        const app = express();

        console.log("Database status:", result);

        app.use(cors());
        app.use(bodyParser.json())

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is Running",
                data: null,
            })
        });


        app.use('/api', router);
        docs(app);
        app.listen(PORT, () => {
            console.log(`Server is Running on http://localhost:${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}
init();