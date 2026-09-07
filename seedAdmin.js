async function createAdmin() {
  try {
    console.log('Sending request to create admin...');
    const response = await fetch('http://localhost:5003/api/auth/admin-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin@mindcare.ai',
        password: 'AdminPassword123!',
        adminCode: 'ELEVANA_ADMIN_2026'
      })
    });
    
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
