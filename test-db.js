require("dotenv").config();

const { Client } = require("pg");

(async () => {
    console.log("Connecting to:");
    console.log(process.env.DATABASE_URL);

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("✅ Connected");

        const result = await client.query("SELECT NOW()");
        console.log(result.rows);

        await client.end();
        console.log("✅ Finished successfully");
    } catch (err) {
        console.error("❌ FAILED");
        console.error(err);
    }
})();