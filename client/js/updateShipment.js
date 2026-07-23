const form = document.getElementById("updateForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const shipmentId = document.getElementById("shipment_id").value;

    const body = {

        status: document.getElementById("status").value,

        location: document.getElementById("location").value,

        description: document.getElementById("description").value

    };

    const response = await fetch(`/api/shipments/${shipmentId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    const data = await response.json();

    if (data.success) {

        alert("Shipment Updated Successfully!");

        form.reset();

    } else {

        alert(data.message);

    }

});