/**
 * Ví dụ 1: Lấy Access Token
 */

const { Config, BaokimAuth } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Lấy Access Token ===\n');

    try {
        Config.load();

        console.log(`1. Config đã load từ: ${Config.get('baseUrl')}`);
        console.log(`   Merchant Code: ${Config.get('merchantCode')}\n`);

        console.log('2. Đang gọi API lấy token...');

        const auth = new BaokimAuth();
        const token = await auth.getToken();

        console.log('3. Lấy token thành công!\n');
        console.log('=== Thông tin Token ===');
        console.log(`Access Token: ${token.substr(0, 50)}...`);
        console.log(`Authorization header: Bearer ${token}\n`);

        console.log('4. Thử lấy token lần 2 (sẽ dùng cache)...');
        const token2 = await auth.getToken();
        console.log('   => Token được lấy từ cache (không gọi lại API)\n');

        console.log('=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
