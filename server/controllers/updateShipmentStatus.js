const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            status,
            location,
            description
        } = req.body;

        await db.query(
            `
            UPDATE shipments
            SET
                status=$1,
                current_location=$2,
                updated_at=NOW()
            WHERE id=$3
            `,
            [
                status,
                location,
                id
            ]
        );

        await db.query(
            `
            INSERT INTO tracking_history
            (
                shipment_id,
                status,
                location,
                description
            )
            VALUES
            ($1,$2,$3,$4)
            `,
            [
                id,
                status,
                location,
                description
            ]
        );

        res.json({
            success: true,
            message: "Shipment updated successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};