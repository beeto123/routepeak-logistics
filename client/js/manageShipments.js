// Check if user is logged in
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/pages/admin-login.html";
}
async function loadShipments() {
    try {
        const response = await fetch("/api/shipments");
        const data = await response.json();
        
        if (!data.success) {
            alert(data.message);
            return;
        }
        
        updateStats(data.shipments);
        renderShipments(data.shipments);
    } catch (err) {
        console.error(err);
        document.getElementById("shipmentsList").innerHTML = 
            `<p class="empty-state">❌ Error loading shipments. Please try again.</p>`;
    }
}

function updateStats(shipments) {
    const container = document.getElementById("statsSummary");
    const total = shipments.length;
    const delivered = shipments.filter(s => 
        s.status?.toLowerCase() === 'delivered'
    ).length;
    const inTransit = shipments.filter(s => 
        s.status?.toLowerCase() === 'in transit' || 
        s.status?.toLowerCase() === 'transit'
    ).length;
    const registered = shipments.filter(s => 
        !s.status || 
        s.status?.toLowerCase() === 'shipment registered' || 
        s.status?.toLowerCase() === 'registered'
    ).length;
    
    container.innerHTML = `
        <div class="stat-chip">
            📦 Total: <span class="count">${total}</span>
        </div>
        <div class="stat-chip">
            ✅ Delivered: <span class="count">${delivered}</span>
        </div>
        <div class="stat-chip">
            🚚 In Transit: <span class="count">${inTransit}</span>
        </div>
        <div class="stat-chip">
            📋 Registered: <span class="count">${registered}</span>
        </div>
    `;
}

function getStatusClass(status) {
    if (!status) return 'status-registered';
    const lower = status.toLowerCase();
    if (lower === 'delivered') return 'status-delivered';
    if (lower === 'in transit' || lower === 'transit') return 'status-transit';
    if (lower === 'held at customs' || lower === 'customs') return 'status-customs';
    if (lower === 'out for delivery' || lower === 'out') return 'status-out';
    return 'status-registered';
}

function renderShipments(shipments) {
    const container = document.getElementById("shipmentsList");
    
    if (shipments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📭 No Shipments Yet</h3>
                <p>Start by creating your first shipment.</p>
                <a href="/pages/create-shipment.html">Create Shipment →</a>
            </div>
        `;
        return;
    }
    
    let html = `
        <table class="shipment-table">
            <thead>
                <tr>
                    <th>Tracking</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Origin → Destination</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    shipments.forEach(s => {
        const statusClass = getStatusClass(s.status);
        const displayStatus = s.status || 'Registered';
        
        html += `
            <tr>
                <td><strong>${s.tracking_number}</strong></td>
                <td>${s.sender_name || '-'}</td>
                <td>${s.receiver_name || '-'}</td>
                <td>${s.origin || '-'} → ${s.destination || '-'}</td>
                <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
                <td>
                    <div class="action-group">
                        <button class="action-btn action-view" onclick="viewShipment('${s.tracking_number}')">👁️ View</button>
                        <button class="action-btn action-edit" onclick="editShipment('${s.id}')">✏️ Edit</button>
                        <button class="action-btn action-delete" onclick="deleteShipment('${s.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Search functionality
document.getElementById("searchInput")?.addEventListener("input", function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll(".shipment-table tbody tr");
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });
    
    // Show message if no results
    const container = document.getElementById("shipmentsList");
    const existingMsg = container.querySelector(".no-results");
    
    if (visibleCount === 0 && searchTerm.length > 0) {
        if (!existingMsg) {
            const msg = document.createElement("p");
            msg.className = "no-results";
            msg.textContent = `🔍 No shipments found matching "${searchTerm}"`;
            container.appendChild(msg);
        }
    } else {
        if (existingMsg) existingMsg.remove();
    }
});

function viewShipment(trackingNumber) {
    window.location.href = `/tracking?tracking=${trackingNumber}`;
}

// FIXED: Pass UUID as string with quotes
function editShipment(id) {
    console.log("Editing shipment with ID:", id);
    window.location.href = `/pages/edit-shipment.html?id=${id}`;
}

// FIXED: Pass UUID as string with quotes
async function deleteShipment(id) {
    if (!confirm("⚠️ Are you sure you want to delete this shipment? This action cannot be undone.")) {
        return;
    }
    
    try {
        const response = await fetch(`/api/shipments/${id}`, {
            method: "DELETE"
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert("✅ Shipment deleted successfully!");
            loadShipments();
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (err) {
        console.error(err);
        alert("❌ Error deleting shipment. Please try again.");
    }
}

// Load shipments on page load
loadShipments();