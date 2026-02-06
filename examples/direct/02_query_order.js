/**
 * Example: Tra cứu đơn hàng Direct
 */

const { Config, BaokimAuth, BaokimDirect } = require('../../src');

async function main() {
    const mrcOrderId = process.argv[2];

    if (!mrcOrderId) {
        console.log('Usage: node 02_query_order.js <mrc_order_id>');
        return;
    }

    try {
        Config.load();

        const auth = BaokimAuth.forDirectConnection();
        const directService = new BaokimDirect(auth);

        const result = await directService.queryOrder(mrcOrderId);

        if (result.success) {
            console.log('✅ Tra cứu thành công!');
            console.log(`   Order ID: ${result.data.order_id || result.data.id}`);
            console.log(`   Status: ${result.data.status}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
