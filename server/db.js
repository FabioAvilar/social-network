const spicedPg = require("spiced-pg");
const { hash, genSalt, compare } = require("bcryptjs");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = require("./secrets.json");
const DATABASE_NAME = "spiced-petition";
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

module.exports = {
    createUser,
    login,
};
