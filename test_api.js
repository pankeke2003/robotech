
async function checkCategories() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/categories');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error.message);
    }
}

checkCategories();
