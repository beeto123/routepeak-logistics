// Get shipment ID from URL
const urlParams = new URLSearchParams(window.location.search);
const shipmentId = urlParams.get('id');

const form = document.getElementById('editForm');
const submitBtn = document.getElementById('submitBtn');

// Load shipment data
async function loadShipment() {
    if (!shipmentId) {
        alert('❌ No shipment ID provided');
        window.location.href = '/pages/manage-shipments.html';
        return;
    }

    try {
        const response = await fetch(`/api/shipments/${shipmentId}`);
        const data = await response.json();

        if (!data.success) {
            alert(data.message);
            window.location.href = '/pages/manage-shipments.html';
            return;
        }

        const s = data.shipment;
        
        // Display tracking number
        document.getElementById('displayTracking').textContent = s.tracking_number;
        
        // Fill form fields
        document.getElementById('status').value = s.status || 'Shipment Registered';
        document.getElementById('current_location').value = s.current_location || '';
        document.getElementById('status_description').value = '';
        
        document.getElementById('sender_name').value = s.sender_name || '';
        document.getElementById('sender_phone').value = s.sender_phone || '';
        document.getElementById('sender_email').value = s.sender_email || '';
        document.getElementById('sender_address').value = s.sender_address || '';
        
        document.getElementById('receiver_name').value = s.receiver_name || '';
        document.getElementById('receiver_phone').value = s.receiver_phone || '';
        document.getElementById('receiver_email').value = s.receiver_email || '';
        document.getElementById('receiver_address').value = s.receiver_address || '';
        
        document.getElementById('origin').value = s.origin || '';
        document.getElementById('destination').value = s.destination || '';
        document.getElementById('package_type').value = s.package_type || '';
        document.getElementById('weight').value = s.weight || '';
        document.getElementById('shipping_cost').value = s.shipping_cost || '';
        
        if (s.estimated_delivery) {
            const date = new Date(s.estimated_delivery);
            document.getElementById('estimated_delivery').value = date.toISOString().split('T')[0];
        }

    } catch (err) {
        console.error(err);
        alert('❌ Error loading shipment');
        window.location.href = '/pages/manage-shipments.html';
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Updating...';

    const body = {
        status: document.getElementById('status').value,
        location: document.getElementById('current_location').value,
        description: document.getElementById('status_description').value || `Status updated to ${document.getElementById('status').value}`,
        sender_name: document.getElementById('sender_name').value,
        sender_phone: document.getElementById('sender_phone').value,
        sender_email: document.getElementById('sender_email').value,
        sender_address: document.getElementById('sender_address').value,
        receiver_name: document.getElementById('receiver_name').value,
        receiver_phone: document.getElementById('receiver_phone').value,
        receiver_email: document.getElementById('receiver_email').value,
        receiver_address: document.getElementById('receiver_address').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        package_type: document.getElementById('package_type').value,
        weight: document.getElementById('weight').value || null,
        shipping_cost: document.getElementById('shipping_cost').value || null,
        estimated_delivery: document.getElementById('estimated_delivery').value || null
    };

    try {
        const response = await fetch(`/api/shipments/${shipmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ Shipment updated successfully!');
            window.location.href = '/pages/manage-shipments.html';
        } else {
            alert(`❌ ${data.message}`);
        }

    } catch (err) {
        console.error(err);
        alert('❌ Error updating shipment');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Update Shipment';
    }
});

// Load shipment data
loadShipment();