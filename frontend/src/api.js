const API_BASE = 'https://autonomousinventorymarkdownagent.onrender.com';

export async function uploadInventory(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/inventory/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return await res.json();
}


export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard-stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}

export async function getInventory() {
  const res = await fetch(`${API_BASE}/inventory`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return await res.json();
}

export async function createInventoryItem(item) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create item');
  return await res.json();
}

export async function updateInventoryItem(productId, item) {
  const res = await fetch(`${API_BASE}/inventory/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update item');
  return await res.json();
}

export async function deleteInventoryItem(productId) {
  const res = await fetch(`${API_BASE}/inventory/${productId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete item');
  return await res.json();
}

export async function deleteAllInventory() {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete all items');
  return await res.json();
}

export async function getReports() {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return await res.json();
}

export async function approveReport(taskId) {
  const res = await fetch(`${API_BASE}/report/${taskId}/approve`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to approve report');
  return await res.json();
}

export async function rejectReport(taskId) {
  const res = await fetch(`${API_BASE}/report/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to reject report');
  return await res.json();
}

export async function deleteApprovedReports() {
  const res = await fetch(`${API_BASE}/reports/approved`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete approved reports');
  return await res.json();
}

export async function runAnalysis(payload) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to start analysis');
  return await res.json();
}
