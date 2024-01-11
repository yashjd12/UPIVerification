const axios = require('axios');
require('dotenv').config();

// Access the values
const apiKey = process.env.API_KEY;
const accountId = process.env.ACCOUNT_ID;


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
        
            // Check if the task has a result and is completed
            const firstTask = taskStatusResponse.data[0];
            if (firstTask && firstTask.status === 'completed' && firstTask.result) {
                console.log('UPI verification completed!');
                break; // Exit the loop if the task is completed with a result
            }
        
            // Wait for a few seconds before checking again (adjust as needed)
            await new Promise(resolve => setTimeout(resolve, 5000));
        
        } while (true); // Infinite loop, but it will break when the task is completed
        
        // Process verification result
        const verificationResult = taskStatusResponse.data[0].result;
        
        // Check if the UPI address is valid and the account exists
        if (verificationResult.account_exists === 'YES' && verificationResult.status === 'id_found') {
            console.log('UPI verification successful!');
            console.log('UPI Address:', verificationResult.vpa);
            console.log('Name of the User:', verificationResult.name_at_bank);
        
            // Return the verification result
            return verificationResult;
        } else {
            console.log('UPI verification failed. Please check the provided UPI address.');
            throw new Error('UPI verification failed');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        throw error;
    }
}

// Export the function for use in other files
module.exports = { verifyUPIAddress };
