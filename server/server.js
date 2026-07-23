require("dotenv").config();
console.log("🔥 THIS IS MY SERVER.JS");

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Database connection
const db = require("./config/database");

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/tracking", require("./routes/publicRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Server & Database OK"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ========================================
// STATIC FILES
// ========================================

const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));

// ========================================
// FRONTEND ROUTES
// ========================================

app.get("/", (req, res) => {

    const file = path.join(clientPath, "index.html");

    console.log("================================");
    console.log("SERVING THIS FILE:");
    console.log(file);
    console.log("================================");

    res.sendFile(file);

});

app.get("/tracking", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/tracking.html"));
});

app.get("/pages/admin-login.html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/admin-login.html"));
});

app.get("/pages/admin-dashboard.html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/admin-dashboard.html"));
});

app.get("/pages/create-shipment.html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/create-shipment.html"));
});

app.get("/pages/manage-shipments.html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/manage-shipments.html"));
});

app.get("/pages/edit-shipment.html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages/edit-shipment.html"));
});

// ========================================
// CATCH ALL - Works with Express v4
// ========================================

app.get("*", (req, res) => {
    const filePath = path.join(clientPath, req.path);
    const fs = require("fs");
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        // Try with .html
        const htmlPath = filePath + ".html";
        if (fs.existsSync(htmlPath)) {
            res.sendFile(htmlPath);
        } else {
            res.status(404).json({ 
                error: "Not Found",
                path: req.path 
            });
        }
    }
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ RoutePeak running on port ${PORT}`);
});

module.exports = app;