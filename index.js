const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { verifyUPIAddress } = require('./upiVerificationScript'); // Replace with the actual path to your UPI verification script

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(bodyParser.json());

// UPI verification endpoint
app.post('/verify-upi', async (req, res) => {
    const upiAddress = req.body.upiAddress;

    try {
        const verificationResult = await verifyUPIAddress(upiAddress);

        // Send the verification result back to the frontend
        res.json(verificationResult);
    } catch (error) {
        console.error('Error during UPI verification:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle user verification and display details
app.post('/verify-user', async (req, res) => {
    const upiAddress = req.body.upiAddress;

    try {
        const verificationResult = await verifyUPIAddress(upiAddress);

        // Send the verification result to the '/verify-user' route
        res.json(verificationResult);
    } catch (error) {
        console.error('Error during UPI verification:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
