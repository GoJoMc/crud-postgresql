const CRUD = require("./functionDB");
const cli = require("./clientDB");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

async function dbAccessQuery() {
    await cli.query(
        "ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);"
    );
}

const question = text => new Promise(resolve => rl.question(text, resolve));

let loop = true;

async function main() {
    while (loop) {
        let answer = await question("TASK : ");
        switch (answer.toLowerCase()) {
            case "create":
                let name4C = await inputName("Enter name: ");
                let age4C = await inputNumber("Enter age: ");
                while (true) {
                    let email4C = await inputEmail("Enter email: ");
                    let res4C = await CRUD.createUser(name4C, email4C, age4C);
                    message(res4C);
                    if (res4C.success) break;
                }
                break;
            case "read":
                let res4R = await CRUD.readUser();
                message(res4R);
                break;
            case "update":
                let id4U = await inputNumber("Enter user ID to update: ");
                let name4U = await question("Enter new name: ");

                let email4U = await question("Enter Your Active Email: ");
                let age4U = await question("Enter new age: ");

                let res4U = await CRUD.updateUser(
                    parseInt(id4U),
                    name4U,
                    parseInt(age4U),
                    email4U
                );

                message(res4U);
                break;
            case "delete":
                let id4D = await inputNumber("Enter user ID to delete: ");
                if (id4D === 999) {
                    let confirm = await question(
                        "Type DELETE_ALL to confirm: "
                    );
                    if (confirm === "DELETE_ALL") {
                        await cli.query(
                            "TRUNCATE TABLE users RESTART IDENTITY"
                        );
                        console.log("success To Delete All Users 😭");
                    }
                    break;
                }

                let res4D = await CRUD.deleteUser(id4D);

                message(res4D);

                break;
            case "exit":
                cli.end();
                rl.close();
                loop = false;
                break;

            default:
                console.log("Create, Read, Update, Delete, Exit");
                break;
        }
    }
}

function message(res) {
    if (!res.success) {
        console.log("ERROR:", res.error);
        return;
    }

    if (res.data) {
        console.table(res.data);
    }

    if (res.message) {
        console.log(res.message);
    }
}

async function inputName(text) {
    while (true) {
        let input = await question(text);

        input = input.trim();

        const valid = /^[\p{L}\s]+$/u.test(input);

        if (valid) {
            return input;
        }

        console.log("Name can only contain letters 😐");
    }
}

async function inputEmail(text) {
    while (true) {
        let input = await question(text);

        input = input.trim().toLowerCase();

        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

        if (valid) {
            return input;
        }

        console.log("Invalid email format 😐");
    }
}

async function inputNumber(text) {
    while (true) {
        let input = await question(text);

        let number = parseInt(input);

        if (!isNaN(number)) {
            return number;
        }

        console.log("Only Number Input");
    }
}

main();
//dbAccessQuery();
