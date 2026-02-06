/**
 * Example: Lấy Access Token
 */

const { Config, BaokimAuth } = require('../../src');

async function main() {
    try {
        Config.load();

        const auth = new BaokimAuth();
        const token = await auth.getToken();

        console.log('✅ Token acquired successfully!');
        console.log(`   Token: ${token.substring(0, 50)}...`);
        console.log(`   Authorization Header: Bearer ${token.substring(0, 30)}...`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
