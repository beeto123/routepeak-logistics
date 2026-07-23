const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT *
            FROM shipments
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        res.json({
            success: true,
            shipment: result.rows[0]
        });

    } catch (err) {

        console.error("GET SHIPMENT BY ID ERROR:");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};