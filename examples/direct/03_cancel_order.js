/**
 * Example: Hủy đơn hàng Direct
 */

const { Config, BaokimAuth, BaokimDirect } = require('../../src');

async function main() {
    const mrcOrderId = process.argv[2];

    if (!mrcOrderId) {
        console.log('Usage: node 03_cancel_order.js <mrc_order_id>');
        return;
    }

    try {
        Config.load();

        const auth = BaokimAuth.forDirectConnection();
        const directService = new BaokimDirect(auth);

        const result = await directService.cancelOrder(mrcOrderId, 'Customer requested cancellation');

        if (result.success) {
            console.log('✅ Hủy đơn thành công!');
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
