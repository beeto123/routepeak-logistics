document.addEventListener("DOMContentLoaded", () => {

    const button = document.createElement("a");

    button.href =
        "https://wa.me/2349046305994?text=Hello%20RoutePeak%20Logistics,%20I%20need%20assistance%20with%20my%20shipment.";

    button.target = "_blank";

    button.className = "whatsapp-float";

    button.innerHTML = `
        <i class="fa-brands fa-whatsapp"></i>
    `;

    document.body.appendChild(button);

});