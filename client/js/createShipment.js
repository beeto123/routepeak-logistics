const form = document.getElementById("shipmentForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Creating...";

    const body = {};

    [
        "sender_name",
        "sender_phone",
        "sender_email",
        "sender_address",
        "receiver_name",
        "receiver_phone",
        "receiver_email",
        "receiver_address",
        "origin",
        "destination",
        "package_type",
        "weight",
        "shipping_cost",
        "estimated_delivery"
    ].forEach(id => {
        body[id] = document.getElementById(id).value;
    });

    console.log("Sending:", body);

    try {
        const response = await fetch("/api/shipments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Response:", data);

        if (response.ok && data.success) {
            alert(`✅ Shipment Created Successfully!\n\n📦 Tracking Number: ${data.tracking_number}\n\nYou can track this shipment anytime.`);
            form.reset();
        } else {
            alert(`❌ ${data.message || "Failed to create shipment."}`);
        }

    } catch (err) {
        console.error(err);
        alert("❌ Network error. Please check your connection.");
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = "🚀 Create Shipment";
    }
});