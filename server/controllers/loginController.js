const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await db.query(

            "SELECT * FROM admins WHERE email=$1",

            [email]

        );

        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email"

            });

        }

        const admin = result.rows[0];

        const validPassword = await bcrypt.compare(

            password,

            admin.password

        );

        if (!validPassword) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                id: admin.id,

                email: admin.email,

                role: admin.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            success: true,

            token,

            admin: {

                id: admin.id,

                name: admin.full_name,

                email: admin.email

            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = login;