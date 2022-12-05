const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001 } = process.env;
const cookieSession = require("cookie-session");
const {
    createUser,
    login,
    getUserById,
    updatePicture,
    updateBio,
    getRecentUsers,
    findUser,
} = require("./db");

const s3upload = require("./s3");
const { uploader } = require("./uploader");
const { AWS_BUCKET } = require("./secrets.json");

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
        res.json({ user_id: null });
    } else {
        res.json({ user_id: req.session.user_id });
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
        if (error.constraint == "users_email_key") {
            res.status(400).json({ error: "duplicate email " });
        } else {
            res.status(500).json({ error: "oppss ERRORR 😱😱" });
        }
    }
});

app.post("/api/login", async (req, res) => {
    try {
        // console.log("req.body", req.body);
        const user = await login(req.body);
        // console.log("funçao do login: ", user);
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

app.get("/api/users/me", (req, res) => {
    getUserById(req.session.user_id).then((user) => {
        if (!user) {
            res.json(null);
            return;
        }
        const { first_name, last_name, email, profile_picture_url, bio } = user;
        res.json({ first_name, last_name, email, profile_picture_url, bio });
    });
});

app.post(
    "/api/users/me/picture",
    uploader.single("image"),
    s3upload,
    async (req, res) => {
        const profile_picture_url = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
        const image = await updatePicture({
            profile_picture_url,
            id: req.session.user_id,
        });

        if (req.file) {
            res.json(image);
        } else {
            res.json({
                success: false,
            });
        }
    }
);

app.post("/api/users/me/bio", async (req, res) => {
    console.log("req.body.bio", req.body.bio);
    console.log(", req.session.user_id", req.session.user_id);
    try {
        const newBio = await updateBio(req.body.bio, req.session.user_id);
        console.log("tests server Bio :", newBio);
        res.json(newBio);
    } catch (error) {
        console.log("error updateBio 😱 : ", error);
    }
});

app.get("/api/users", async (req, res) => {
    console.log("********* /api/users ***********");
    console.log("req.query: ", req.query);
    const { q } = req.query;
    console.log("query q: ", q);
    try {
        if (!q) {
            const recentUsers = await getRecentUsers();
            console.log("para ver os ultimos usuarios: ", recentUsers);
            res.json(recentUsers);
            return;
        }
        const users = await findUser(q);
        res.json(users);
    } catch (error) {
        console.log("ERROR api/users", error);
        res.json({ success: false });
    }
});

app.get("/api/users/:id", async (req, res) => {
    console.log("req.params", req.params);
    const {id} = req.params;
    const {user_id} = req.session;
    const otherUser = await getUserById(id);
    if (id == user_id || !otherUser) {
        res.json(null);
        return;
    } else {
        res.json(otherUser);
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
