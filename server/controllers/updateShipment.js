const db = require("../config/database");

module.exports = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            status,
            location,
            description,
            sender_name,
            sender_phone,
            sender_email,
            sender_address,
            receiver_name,
            receiver_phone,
            receiver_email,
            receiver_address,
            origin,
            destination,
            package_type,
            weight,
            shipping_cost,
            estimated_delivery
        } = req.body;

        // Update main shipment
        await db.query(
            `
            UPDATE shipments
            SET
                status=$1,
                current_location=$2,
                sender_name=$3,
                sender_phone=$4,
                sender_email=$5,
                sender_address=$6,
                receiver_name=$7,
                receiver_phone=$8,
                receiver_email=$9,
                receiver_address=$10,
                origin=$11,
                destination=$12,
                package_type=$13,
                weight=$14,
                shipping_cost=$15,
                estimated_delivery=$16,
                updated_at=NOW()
            WHERE id=$17
            `,
            [
                status,
                location,
                sender_name,
                sender_phone,
                sender_email,
                sender_address,
                receiver_name,
                receiver_phone,
                receiver_email,
                receiver_address,
                origin,
                destination,
                package_type,
                weight,
                shipping_cost,
                estimated_delivery,
                id
            ]
        );

        // Add to tracking history if status or location changed
        if (status || location) {
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
                    status || 'Updated',
                    location || '',
                    description || `Shipment status updated to ${status}`
                ]
            );
        }

        res.json({
            success: true,
            message: "Shipment updated successfully."
        });

    } catch (err) {

        console.error("UPDATE SHIPMENT ERROR:");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};