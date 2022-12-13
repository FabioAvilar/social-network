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
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriends,
    getChatMessages,
    createChatMessage,
    deleteYourCount,
    updateUser,
} = require("./db");

const s3upload = require("./s3");
const { uploader } = require("./uploader");
const { AWS_BUCKET } = require("./secrets.json");

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { SESSION_SECRET } = require("./secrets.json");

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

const server = require("http").Server(app);
const socketConnect = require("socket.io");
const io = socketConnect(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});
app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// end socket io

app.use(cookieSessionMiddleware);

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

app.get("/api/delete", async (req, res) => {
    try {
        const deleteUsers = await deleteYourCount(
            req.session.user_id
        );
        console.log("tests server DELETE ME :", deleteUsers);
        req.session = null;
        res.json(deleteUsers);
    } catch (error) {
        console.log("error DELETE ME 🩻🩻 : ", error);
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
    const { id } = req.params;
    const { user_id } = req.session;
    const otherUser = await getUserById(id);
    if (id == user_id || !otherUser) {
        res.json(null);
        return;
    } else {
        res.json(otherUser);
    }
});

function getFriendshipStatus(friendship, loggedUserId) {
    if (!friendship) {
        return "NO_FRIENDSHIP";
    }
    if (!friendship.accepted && friendship.sender_id === loggedUserId) {
        return "OUTGOING_FRIENDSHIP";
    }
    if (!friendship.accepted && friendship.recipient_id === loggedUserId) {
        return "INCOMING_FRIENDSHIP";
    }
    if (friendship.accepted) {
        return "ACCEPTED_FRIENDSHIP";
    }
}

app.get("/api/friendships/:user_id", async (req, res) => {
    const loggedUserId = req.session.user_id;
    const otherUserId = req.params.user_id;

    const friendship = await getFriendship({
        first_id: loggedUserId,
        second_id: otherUserId,
    });

    const status = getFriendshipStatus(friendship, loggedUserId);
    res.json({ ...friendship, status });
});

app.post("/api/friendships/:user_id", async (req, res) => {
    const loggedUserId = req.session.user_id;
    const otherUserId = req.params.user_id;
    console.log("loggedUserId eu testando: ", loggedUserId);
    console.log("otherUserId eu testando: ", otherUserId);

    const friendship = await getFriendship({
        first_id: loggedUserId,
        second_id: otherUserId,
    });

    console.log("teste do get dos friends response: ", friendship);

    const currentStatus = getFriendshipStatus(friendship, loggedUserId);
    let status;

    if (currentStatus === "NO_FRIENDSHIP") {
        await requestFriendship({
            sender_id: loggedUserId,
            recipient_id: otherUserId,
        });
        status = "OUTGOING_FRIENDSHIP";
    }

    if (currentStatus === "INCOMING_FRIENDSHIP") {
        await acceptFriendship({
            sender_id: otherUserId,
            recipient_id: loggedUserId,
        });
        status = "ACCEPTED_FRIENDSHIP";
    }

    if (
        currentStatus === "ACCEPTED_FRIENDSHIP" ||
        currentStatus === "OUTGOING_FRIENDSHIP"
    ) {
        await deleteFriendship({
            first_id: loggedUserId,
            second_id: otherUserId,
        });
        status = "NO_FRIENDSHIP";
    }

    res.json({ status });
});

app.get("/api/friendships", async (req, res) => {
    const friendships = await getFriends(req.session.user_id);
    res.json(
        friendships.map((friendship) => ({
            ...friendship,
            status: getFriendshipStatus(friendship, req.session.user_id),
        }))
    );
});

app.get("/logout", (req, res) => {
    (req.session = null), res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socked connection", socket.id);
    console.log("session", socket.request.session);
    const { user_id } = socket.request.session;
    if (!user_id) {
        return socket.disconnect(true);
    }
    // console.log("user_id in socket", user_id);

    // send back the latest 10 messages to every new connected user
    const messages = await getChatMessages({ limit: 10 });
    console.log("messages", messages);
    socket.emit("recentMessages", messages.reverse());

    socket.on("sendMessage", async ({ text }) => {
        // save to db
        const message = await createChatMessage({
            sender_id: user_id,
            text,
        });

        // get user info
        const user = await getUserById(user_id);
        const { first_name, last_name, profile_picture_url } = user;

        //forward it to everbody - user io.emit!
        io.emit("newMessage", {
            first_name,
            last_name,
            profile_picture_url,
            ...message,
        });
    });
});

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
