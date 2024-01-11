const axios = require('axios');

// Replace these placeholders with your actual values
const apiKey = '4ac9b6ce-127e-455d-ac5b-6fb7f2adbc7a';
const accountId = '0a41387ddb36/9d7b7e3d-db3f-42e9-be2d-ace1d8d6e734';

console.log('Before UPI verification request');
// Function to verify UPI address
async function verifyUPIAddress(vpaAddress) {
    try {
        // Step 1: Request UPI verification
        const verifyUPIResponse = await axios.post('https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_vpa', {
            task_id: '10072002', // Replace with a unique UUID
            group_id: '1', // Replace with a unique UUID
            data: {
                vpa: vpaAddress,
            },
        }, {
            headers: {
                'api-key': apiKey,
                'account-id': accountId,
                'Content-Type': 'application/json',
            },
        });

        const requestId = verifyUPIResponse.data.request_id;

        // Step 2: Check task status to get verification result
        let taskStatusResponse;
        do {
            console.log('Checking task status...');

            // Make a request to get task status
            taskStatusResponse = await axios.get(`https://eve.idfy.com/v3/tasks?request_id=${requestId}`, {
                headers: {
                    'api-key': apiKey,
                    'account-id': accountId,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Task status response:', taskStatusResponse.data);

            // Wait for a few seconds before checking again (adjust as needed)
            await new Promise(resolve => setTimeout(resolve, 5000));

        } while (taskStatusResponse.data.status !== 'completed');

        console.log('UPI verification completed!');

        // Step 3: Process verification result
        const verificationResult = taskStatusResponse.data.result;

        // Check if the UPI address is valid and the account exists
        if (verificationResult.account_exists === 'YES' && verificationResult.status === 'id_found') {
            console.log('UPI verification successful!');
            console.log('UPI Address:', verificationResult.vpa);
            console.log('Name of the User:', verificationResult.name_at_bank);
        } else {
            console.log('UPI verification failed. Please check the provided UPI address.');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

console.log('After UPI verification request');

// Example: Replace 'your-upi-address' with the UPI address you want to verify
verifyUPIAddress('yashjappu@oksbi');
