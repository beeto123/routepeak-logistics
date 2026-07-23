const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const { trackingNumber } = req.params;

        // Get shipment details
        const shipmentResult = await db.query(
            `
            SELECT *
            FROM shipments
            WHERE tracking_number = $1
            `,
            [trackingNumber]
        );

        if (shipmentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        const shipment = shipmentResult.rows[0];

        // Get tracking history
        const historyResult = await db.query(
            `
            SELECT *
            FROM tracking_history
            WHERE shipment_id = $1
            ORDER BY created_at DESC
            `,
            [shipment.id]
        );

        res.json({
            success: true,
            shipment: shipment,
            history: historyResult.rows
        });

    } catch (err) {

        console.error("TRACKING ERROR:");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};