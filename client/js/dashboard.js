let shipmentChart = null;

async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");
        const data = await response.json();

        console.log(data);

        if (!data.success) {
            alert(data.message);
            return;
        }

        document.getElementById("totalShipments").textContent = data.stats.total;
        document.getElementById("registeredShipments").textContent = data.stats.registered;
        document.getElementById("inTransitShipments").textContent = data.stats.inTransit;
        document.getElementById("deliveredShipments").textContent = data.stats.delivered;
        document.getElementById("customsShipments").textContent = data.stats.customs;

        drawChart(data.stats);

    } catch (err) {

        console.error(err);

    }

}

function drawChart(stats) {

    const canvas = document.getElementById("shipmentChart");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (shipmentChart) {
        shipmentChart.destroy();
    }

    shipmentChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Registered",
                "In Transit",
                "Delivered",
                "Held At Customs"
            ],

            datasets: [

                {

                    data: [
                        stats.registered,
                        stats.inTransit,
                        stats.delivered,
                        stats.customs
                    ],

                    backgroundColor: [
                        "#7f8c8d",
                        "#3498db",
                        "#2ecc71",
                        "#f39c12"
                    ],

                    borderWidth: 0

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

loadDashboard();