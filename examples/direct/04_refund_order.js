/**
 * Example: Hoàn tiền đơn hàng Direct
 */

const { Config, BaokimAuth, BaokimDirect } = require('../../src');

async function main() {
    const mrcOrderId = process.argv[2];
    const amount = parseInt(process.argv[3]);

    if (!mrcOrderId || !amount) {
        console.log('Usage: node 04_refund_order.js <mrc_order_id> <amount>');
        console.log('Example: node 04_refund_order.js DRT_123456 50000');
        return;
    }

    try {
        Config.load();

        const auth = BaokimAuth.forDirectConnection();
        const directService = new BaokimDirect(auth);

        // Note: Direct connection refund sử dụng cùng method như Basic/Pro
        // nhưng cần implement thêm nếu API endpoint khác
        console.log('⚠️ Direct refund sử dụng endpoint riêng.');
        console.log('   Để hoàn tiền, vui lòng liên hệ Baokim hoặc sử dụng dashboard.');

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
