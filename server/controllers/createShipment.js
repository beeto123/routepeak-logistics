const db = require("../config/database");
const { randomUUID } = require("crypto");

module.exports = async (req, res) => {

    try {

        const trackingNumber =
            "RPL" +
            Date.now().toString().slice(-8) +
            Math.floor(Math.random() * 900 + 100);

        const shipment = req.body;

        const result = await db.query(
            `
            INSERT INTO shipments
            (
                tracking_number,
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
            )
            VALUES
            (
                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                $10,$11,$12,$13,$14,$15
            )
            RETURNING id
            `,
            [
                trackingNumber,
                shipment.sender_name,
                shipment.sender_phone,
                shipment.sender_email,
                shipment.sender_address,
                shipment.receiver_name,
                shipment.receiver_phone,
                shipment.receiver_email,
                shipment.receiver_address,
                shipment.origin,
                shipment.destination,
                shipment.package_type,
                shipment.weight || null,
                shipment.shipping_cost || null,
                shipment.estimated_delivery || null
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
                result.rows[0].id,
                "Shipment Registered",
                shipment.origin || "",
                "Shipment has been registered."
            ]
        );

        res.json({
            success: true,
            tracking_number: trackingNumber
        });

    } catch (err) {

    console.error("CREATE SHIPMENT ERROR:");
    console.error(err);

    res.status(500).json({
        success:false,
        message:err.message
    });

}

};