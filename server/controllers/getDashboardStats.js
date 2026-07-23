const db = require("../config/database");

module.exports = async (req, res) => {
    try {

        const total = await db.query(
            `SELECT COUNT(*) FROM shipments`
        );

        const registered = await db.query(
            `SELECT COUNT(*) FROM shipments
             WHERE status='Shipment Registered'`
        );

        const transit = await db.query(
            `SELECT COUNT(*) FROM shipments
             WHERE status='In Transit'`
        );

        const delivered = await db.query(
            `SELECT COUNT(*) FROM shipments
             WHERE status='Delivered'`
        );

        const customs = await db.query(
            `SELECT COUNT(*) FROM shipments
             WHERE status='Held At Customs'`
        );

        res.json({
            success: true,
            stats: {
                total: Number(total.rows[0].count),
                registered: Number(registered.rows[0].count),
                inTransit: Number(transit.rows[0].count),
                delivered: Number(delivered.rows[0].count),
                customs: Number(customs.rows[0].count)
            }
        });

    } catch (err) {

        console.error("DASHBOARD ERROR");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};