/**
 * Webhook Receiver - Node.js
 * 
 * Endpoint nhận webhook từ Baokim
 * Deploy trên server và cung cấp URL cho Baokim
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Config
const PORT = process.env.PORT || 3000;
const BAOKIM_PUBLIC_KEY_PATH = path.join(__dirname, '../keys/baokim_public.pem');

/**
 * Verify signature từ Baokim
 */
function verifySignature(data, signature) {
    if (!fs.existsSync(BAOKIM_PUBLIC_KEY_PATH)) {
        console.log('Warning: Baokim public key not found, skipping verification');
        return true;
    }

    const publicKey = fs.readFileSync(BAOKIM_PUBLIC_KEY_PATH, 'utf8');
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);
    verifier.end();

    try {
        return verifier.verify(publicKey, signature, 'base64');
    } catch (e) {
        return false;
    }
}

/**
 * Log webhook
 */
function logWebhook(type, data) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${type}] ${JSON.stringify(data)}\n`;
    const logFile = path.join(__dirname, '../logs', `webhook_${new Date().toISOString().split('T')[0]}.log`);

    fs.appendFileSync(logFile, logLine);
}

/**
 * HTTP Server
 */
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('\n=== Nhận Webhook ===');
            console.log(`Time: ${new Date().toISOString()}`);
            console.log(`Path: ${req.url}`);

            try {
                const data = JSON.parse(body);
                const signature = req.headers['signature'] || '';

                console.log('Data:', JSON.stringify(data, null, 2));

                // Verify signature
                const isValid = verifySignature(body, signature);
                console.log(`Signature valid: ${isValid}`);

                // Log webhook
                logWebhook(isValid ? 'VALID' : 'INVALID', data);

                // Process webhook
                if (data.type === 'PAYMENT' || data.action === 'PAYMENT') {
                    console.log('\n>>> Webhook thanh toán');
                    const tx = data.transaction || data.data?.transaction;
                    if (tx) {
                        console.log(`   Order: ${tx.mrc_order_id}`);
                        console.log(`   Amount: ${tx.amount}`);
                        console.log(`   Status: ${tx.status}`);
                    }
                }

                // Response
                const response = {
                    code: 0,
                    message: 'OK',
                    data: null
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));

            } catch (e) {
                console.error('Parse error:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ code: 400, message: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Baokim Webhook Receiver - Node.js 18');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Webhook server running at http://localhost:${PORT}`);
    console.log('Waiting for webhooks from Baokim...\n');
});
