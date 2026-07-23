const db = require("../config/database");

module.exports = async (req, res) => {

    console.log("🔥🔥🔥 NEW getAllShipments controller is running");

    try {

        const result = await db.query(`
            SELECT *
            FROM shipments
            ORDER BY created_at DESC
        `);

        console.log("Returned rows:", result.rows.length);

        return res.json({
            success: true,
            shipments: result.rows
        });

    } catch (err) {

        console.error("GET ALL SHIPMENTS ERROR");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};