const cli = require("./clientDB");

async function createUser(name, email, age) {
    try {
        await cli.query(
            `
            INSERT INTO users(name, email, age)
            VALUES($1, $2, $3);
            `,
            [name, email, age]
        );

        return {
            success: true,
            message: "user created successfully"
        };
    } catch (err) {
        if (err.code === "23505") {
            return {
                success: false,
                error: "Email already exists 😭"
            };
        }

        return {
            success: false,
            error: err.message
        };
    }
}

async function readUser() {
    try {
        const res = await cli.query("SELECT * FROM users");

        return {
            success: true,
            data: res.rows
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

async function updateUser(id, name, email, age) {
    try {
        const res = await cli.query(
            `
            UPDATE users
            SET
                name = $1,
                email = $2,
                age = $3,
            WHERE id = $4;
            `,
            [name, email, age, id]
        );

        if (res.rowCount === 0) {
            return {
                success: false,
                error: "User not found 😐"
            };
        }

        return {
            success: true,
            message: "user updated successfully"
        };
    } catch (err) {
        if (err.code === "23505") {
            return {
                success: false,
                error: "Email already exists 😭"
            };
        }

        return {
            success: false,
            error: err.message
        };
    }
}

async function deleteUser(id) {
    try {
        await cli.query("DELETE FROM users WHERE id = $1", [id]);

        return {
            success: true,
            message: "user deleted successfully"
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser
};
