/**
 * Example: Hoàn tiền đơn hàng
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    const mrcOrderId = process.argv[2];
    const amount = parseInt(process.argv[3]);

    if (!mrcOrderId || !amount) {
        console.log('Usage: node 04_refund_order.js <mrc_order_id> <amount>');
        console.log('Example: node 04_refund_order.js ORDER_123456 50000');
        return;
    }

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        const result = await orderService.refundOrder(mrcOrderId, amount, 'Hoàn tiền cho khách');

        if (result.success) {
            console.log('✅ Hoàn tiền thành công!');
            console.log(`   Order ID: ${mrcOrderId}`);
            console.log(`   Amount: ${amount.toLocaleString()} VND`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
