import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from 'cors';
import bodyparser from 'body-parser';
import { getUserData } from "./utils";


export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const users: UserData[] = [];

const app = express();
app.use(bodyparser.json())

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.post("/login", (req: Request, res: Response) => {
    //console.log(users);
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.sendStatus(404);
    }

    if (bcrypt.compareSync(password, user.password)) {
        return res.status(200).json({ message: "OK" });
    } else {
        return res.sendStatus(403);
    }
});

app.post("/register", (req: Request, res: Response) => {
    //console.log(users);
    const { firstName, lastName, email, password, confirmPassword  } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).send("Name or password are invalid");
    }
    if (users.find((u) => u.email === email)) {
        return res.status(409).send("User with that email already exists!");
    }
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser: UserData = { firstName: firstName, lastName: lastName, email: email, password: hashedPassword };

    users.push(newUser);
    return res.status(201).json({ message: "User registered successfully" });
});

app.listen(3001, () => console.log("listening on port 3001"));

export {};