const db = require("../config/database");

module.exports = async (req, res) => {

    const total = await db.query(

        "SELECT COUNT(*) FROM shipments"

    );

    const transit = await db.query(

        "SELECT COUNT(*) FROM shipments WHERE status='In Transit'"

    );

    const delivered = await db.query(

        "SELECT COUNT(*) FROM shipments WHERE status='Delivered'"

    );

    res.json({

        total: total.rows[0].count,

        transit: transit.rows[0].count,

        delivered: delivered.rows[0].count

    });

};