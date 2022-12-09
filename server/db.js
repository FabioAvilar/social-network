const spicedPg = require("spiced-pg");
const { hash, genSalt, compare } = require("bcryptjs");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = require("./secrets.json");
const DATABASE_NAME = "socialnetwork";
const DATABASE_URL = `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`;

const db = spicedPg(DATABASE_URL);

// para esconder a senha
async function hashPassword(password) {
    const salt = await genSalt();
    return hash(password, salt);
}

// para criar usuario
async function createUser({ first_name, last_name, email, password }) {
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
        `
        INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [first_name, last_name, email, hashedPassword]
    );
    return result.rows[0];
}

// seleciona usuario por email
async function getUserByEmail(email) {
    const result = await db.query(
        `
        SELECT * FROM users WHERE email = $1        
        `,
        [email]
    );
    return result.rows[0];
}

// login
async function login({ email, password }) {
    const foundUser = await getUserByEmail(email);
    if (!foundUser) {
        return null;
    }
    const match = await compare(password, foundUser.password_hash);

    if (!match) {
        return null;
    }
    return foundUser;
}

// get user by ID
async function getUserById(id) {
    const result = await db.query(
        `
        SELECT * FROM users WHERE id = $1
        `,
        [id]
    );
    return result.rows[0];
}

// for update a foto
async function updatePicture({ profile_picture_url, id }) {
    const result = await db.query(
        `
        UPDATE users 
        SET profile_picture_url = $1 
        WHERE id = $2
        RETURNING *
        `,
        [profile_picture_url, id]
    );
    return result.rows[0];
}

async function updateBio(bio, id) {
    const result = await db.query(
        `
        UPDATE users 
        SET bio = $1
        WHERE id = $2
        RETURNING *
        `,
        [bio, id]
    );
    return result.rows[0];
}

async function getRecentUsers() {
    const result = await db.query(`
        SELECT * FROM users
        ORDER BY id
        DESC LIMIT 6
    `);
    return result.rows;
}

async function findUser(val) {
    const result = await db.query(
        `
        SELECT id, first_name, last_name, profile_picture_url 
        FROM users
        WHERE first_name 
        ILIKE $1
    `,
        [val + "%"]
    );
    return result.rows;
}

async function getFriendship({ first_id, second_id }) {
    // SELECT sender_id, recipient_id, accepted FROM friendships
    // WHERE sender_id = $1 AND recipient_id = $2
    // OR    sender_id = $2 AND recipient_id = $1
    const result = await db.query(
        `
        SELECT * FROM  friendships
        WHERE sender_id = $1 AND recipient_id = $2
        OR sender_id = $2 AND recipient_id = $1
    `,
        [first_id, second_id]
    );
    return result.rows[0];
}

async function requestFriendship({ sender_id, recipient_id }) {
    // INSERT INTO friendships (...)
    // VALUES (...)
    // RETURNING *`
    const result = await db.query(
        `
        INSERT INTO friendships
        (sender_id, recipient_id) 
        VALUES ($1, $2)
    `,
        [sender_id, recipient_id]
    );
    return result.rows[0];
}

async function acceptFriendship({ sender_id, recipient_id }) {
    // UPDATE friendships ...
    // WHERE ...
    // RETURNING *
    const result = await db.query(
        `
        UPDATE friendships
        SET accepted = true WHERE sender_id = $1 AND recipient_id = $2
    `,
        [sender_id, recipient_id]
    );
    return result.rows[0];
}

async function deleteFriendship({ first_id, second_id }) {
    // DELETE FROM friendships
    // WHERE ...
    // OR    ...
    const result = await db.query(
        `    
        DELETE FROM friendships
        WHERE sender_id = $1 AND recipient_id = $2 
        OR sender_id = $2 AND recipient_id = $1`,
        [first_id, second_id]
    );
    return result.rows[0];
}

async function getFriends(user_id) {
    const results = await db.query(
        `SELECT friendships.accepted,
        friendships.sender_id,
        friendships.recipient_id,
        users.id AS user_id,
        users.first_name, users.last_name, users.profile_picture_url
        FROM friendships JOIN users
        ON (users.id = friendships.sender_id AND friendships.recipient_id = $1)
        OR (users.id = friendships.recipient_id AND friendships.sender_id = $1 AND accepted = true)`,
        [user_id]
    );
    return results.rows;
}

async function getChatMessages({ limit }) {
    const results = await db.query(
        `SELECT chat_messages.*, users.first_name, users.last_name, users.profile_picture_url
        FROM chat_messages
        JOIN users
        ON users.id = chat_messages.sender_id
        ORDER BY id DESC
        LIMIT $1
        `,
        [limit]
    );
    return results.rows;
}

async function createChatMessage({ sender_id, text }) {
    const results = await db.query(
        `
        INSERT INTO chat_messages (sender_id, text)
        VALUES ($1, $2)
        RETURNING *
    `,
        [sender_id, text]
    );
    return results.rows[0];
}

module.exports = {
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
};
