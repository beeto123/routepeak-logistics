require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../config/database");

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash("RoutePeak@2026", 10);

        await db.query(
            `
            INSERT INTO admins (full_name, email, password)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO NOTHING
            `,
            [
                "RoutePeak Administrator",
                "admin@routepeaklogistics.com",
                hashedPassword
            ]
        );

        console.log("✅ Admin Created Successfully");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createAdmin();