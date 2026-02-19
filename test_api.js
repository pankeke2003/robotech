// Configure API base URL (this is a Node.js script, not processed by Vite)
const API_BASE_URL = process.env.API_BASE_URL || "https://tournament-management-backend.up.railway.app/api";

async function checkCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error.message);
    }
}

checkCategories();
