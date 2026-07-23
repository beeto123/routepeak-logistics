const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const trackingNumber = req.params.tracking;

        const shipment = await db.query(
            `
            SELECT *
            FROM shipments
            WHERE tracking_number = $1
            `,
            [trackingNumber]
        );

        if (shipment.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Shipment not found."
            });

        }

        const history = await db.query(
            `
            SELECT
                status,
                location,
                description,
                created_at
            FROM tracking_history
            WHERE shipment_id = $1
            ORDER BY created_at ASC
            `,
            [shipment.rows[0].id]
        );

        return res.json({
            success: true,
            shipment: shipment.rows[0],
            history: history.rows
        });

    } catch (err) {

        console.error("TRACKING ERROR:");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};