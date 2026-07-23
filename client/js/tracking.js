async function trackShipment() {
    const input = document.getElementById('trackingInput');
    const trackingNumber = input.value.trim();
    
    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }
    
    const resultsDiv = document.getElementById('trackingResults');
    
    // Show loading
    resultsDiv.className = 'tracking-results active';
    resultsDiv.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <p style="color:#999;">🔍 Searching for your shipment...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`/api/tracking/${trackingNumber}`);
        const data = await response.json();
        
        if (!data.success) {
            resultsDiv.innerHTML = `
                <div class="not-found">
                    <i class="fas fa-box-open"></i>
                    <h2>Shipment Not Found</h2>
                    <p>We couldn't find a shipment with tracking number: <strong>${trackingNumber}</strong></p>
                    <p style="margin-top:20px;color:#FF6A00;">Please check the number and try again.</p>
                </div>
            `;
            return;
        }
        
        renderTrackingResult(data);
        
    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = `
            <div class="not-found">
                <i class="fas fa-exclamation-triangle" style="color:#f39c12;"></i>
                <h2>Error</h2>
                <p>Something went wrong. Please try again later.</p>
            </div>
        `;
    }
}

function renderTrackingResult(data) {
    const s = data.shipment;
    const history = data.history || [];
    
    const statusClass = getStatusClass(s.status);
    const displayStatus = s.status || 'Registered';
    
    let timelineHtml = '';
    
    if (history.length === 0) {
        timelineHtml = `
            <div class="timeline-item">
                <div class="timeline-status">${displayStatus}</div>
                <div class="timeline-location">${s.origin || 'N/A'}</div>
                <div class="timeline-date">${formatDate(s.created_at)}</div>
                <div class="timeline-description">Shipment has been registered.</div>
            </div>
        `;
    } else {
        history.forEach(item => {
            timelineHtml += `
                <div class="timeline-item">
                    <div class="timeline-status">${item.status || 'Update'}</div>
                    <div class="timeline-location">${item.location || 'N/A'}</div>
                    <div class="timeline-date">${formatDate(item.created_at)}</div>
                    <div class="timeline-description">${item.description || ''}</div>
                </div>
            `;
        });
    }
    
    const resultsDiv = document.getElementById('trackingResults');
    resultsDiv.className = 'tracking-results active';
    resultsDiv.innerHTML = `
        <div class="result-card">
            <!-- Header -->
            <div class="result-header">
                <div>
                    <div class="tracking-number">
                        ${s.tracking_number}
                        <small>Tracking Number</small>
                    </div>
                </div>
                <span class="status-badge-large ${statusClass}">${displayStatus}</span>
            </div>
            
            <!-- Shipment Details -->
            <div class="shipment-details-grid">
                <div class="detail-item">
                    <div class="label">Sender</div>
                    <div class="value">${s.sender_name || 'N/A'}</div>
                    <div style="font-size:13px;color:#999;margin-top:4px;">${s.sender_phone || ''} ${s.sender_email ? '| ' + s.sender_email : ''}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Receiver</div>
                    <div class="value">${s.receiver_name || 'N/A'}</div>
                    <div style="font-size:13px;color:#999;margin-top:4px;">${s.receiver_phone || ''} ${s.receiver_email ? '| ' + s.receiver_email : ''}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Origin</div>
                    <div class="value">${s.origin || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Destination</div>
                    <div class="value">${s.destination || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Package Type</div>
                    <div class="value">${s.package_type || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Weight</div>
                    <div class="value">${s.weight ? s.weight + ' kg' : 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Shipping Cost</div>
                    <div class="value">${s.shipping_cost ? '$' + s.shipping_cost : 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Estimated Delivery</div>
                    <div class="value">${s.estimated_delivery ? formatDate(s.estimated_delivery) : 'N/A'}</div>
                </div>
            </div>
            
            <!-- Timeline -->
            <div class="timeline-section">
                <h3>📋 Tracking History</h3>
                <div class="timeline">
                    ${timelineHtml}
                </div>
            </div>
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

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Allow Enter key to search
document.getElementById('trackingInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        trackShipment();
    }
});

// Auto-search if tracking number is in URL
const urlParams = new URLSearchParams(window.location.search);
const trackingParam = urlParams.get('tracking');
if (trackingParam) {
    document.getElementById('trackingInput').value = trackingParam;
    trackShipment();
}