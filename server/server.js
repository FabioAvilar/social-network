const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001 } = process.env;
const cookieSession = require("cookie-session");
const { createUser, login } = require("./db");

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { SESSION_SECRET } = require("./secrets.json");

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.get("/api/id.json", (req, res) => {
    if (!req.session.user_id) {
        res.json(req.session);
    } else {
        res.json(req.session.user_id);
    }
});

// for createUsers 
app.post("/api/users", async (req, res) => {

    try {
        const newUser = await createUser(req.body);
        req.session.user_id = newUser.id;
        res.json({ success: true });
    } catch (error) {
        console.log("teste erro users ", error);
        res.status(400).json({ error: "oppss ERRORR 😱😱" });
    }
});

app.post("/api/login", async (req, res) => {
    // find the user with credentials from req.body
    // if no user is found -> status 401 + json error
    // if user is found -> res.json({ success: true })
    // if there is a generic error -> status 500 + json error

    // const { email_address, password } = req.body;
    // if (!email_address || !password) {
    //     res.status(400).json({
    //         error: "You must fill out every field!",
    //     });
    //     return;
    // }

    // login(req.body).then((foundUser) => {
    //     if (!foundUser) {
    //         res.status(401).json({
    //             error: "Some data doesnt seem alright, please check it out!",
    //         });
    //     } else {
    //         req.session.user_id = foundUser.id;
    //         res.json({});
    //     }
    // });

    try {
        // console.log("req.body", req.body)
        const user = await login(req.body);
        if (!user) {
            res.status(401).json({
                error: "Please try again 😬😬",
            });
            return;
        }
        req.session.user_id = user.id;
        res.json({ success: true });
    } catch (error) {
        console.log("POST login", error);
        res.status(500).json({ error: "😑😑 wrong" });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
