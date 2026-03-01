const mongoose = require('mongoose');

// Hardcoded URI for diagnostic test
const uri = "mongodb+srv://vishal0909:vishal6367@cluster0.x75wki2.mongodb.net/?appName=Cluster0";

async function testConnection() {
    console.log('Testing MongoDB connection...');

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('SUCCESS: Connection established! (It means your IP is correctly allowed or set to 0.0.0.0/0)');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Connection failed.');
        console.error('Error Message:', err.message);

        if (err.message.includes('Project IP access list') || err.message.includes('not authorized from this IP')) {
            console.log('\nDIAGNOSIS: NO, it is NOT set to "Access From Everywhere". Your current IP is blocked.');
        } else if (err.message.includes('SSL') || err.message.includes('alert number 80')) {
            console.log('\nDIAGNOSIS: This SSL error often happens on Windows protected networks if the IP is NOT whitelisted in Atlas.');
        }

        process.exit(1);
    }
}

testConnection();
