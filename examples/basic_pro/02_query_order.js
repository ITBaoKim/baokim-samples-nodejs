/**
 * Example: Tra cứu đơn hàng
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    const mrcOrderId = process.argv[2];

    if (!mrcOrderId) {
        console.log('Usage: node 02_query_order.js <mrc_order_id>');
        return;
    }

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        const result = await orderService.queryOrder(mrcOrderId);

        if (result.success) {
            const order = result.data.order;
            console.log('✅ Tra cứu thành công!');
            console.log(`   Order ID: ${order.id}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Amount: ${order.total_amount}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
