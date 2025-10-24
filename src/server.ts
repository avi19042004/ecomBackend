import express, { Request, Response } from "express";
import { port } from "./configs/envConfig";
import { connectToDB } from "./configs/dbConfig";
import appRoutes from "./routes/allRoutes"

const app = express();
app.use(appRoutes)
connectToDB();


app.get('/', (req: Request, res: Response) => {
    res.status(200).send({"msg" : "Server Is Running"})
})

app.listen(port, ()=> {
    console.log(`Server running on http://localhost:${port}`);
})