const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const shipmentId = req.params.id;

        // Delete tracking history first
        await db.query(
            `
            DELETE FROM tracking_history
            WHERE shipment_id = $1
            `,
            [shipmentId]
        );

        // Delete shipment
        const result = await db.query(
            `
            DELETE FROM shipments
            WHERE id = $1
            RETURNING *
            `,
            [shipmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found."
            });
        }

        res.json({
            success: true,
            message: "Shipment deleted successfully."
        });

    } catch (err) {

        console.error("DELETE SHIPMENT ERROR:");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};