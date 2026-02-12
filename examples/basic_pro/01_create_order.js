/**
 * Example: Tạo đơn hàng Basic/Pro
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        const mrcOrderId = `ORDER_${Date.now()}`;

        const result = await orderService.createOrder({
            mrcOrderId,
            totalAmount: 100000,
            description: `Thanh toán đơn hàng ${mrcOrderId}`,
            customerInfo: BaokimOrder.buildCustomerInfo(
                'Nguyen Van A',
                'test@example.com',
                '0901234567',
                '123 Test Street'
            ),
        });

        if (result.success) {
            console.log('✅ Tạo đơn thành công!');
            console.log(`   Order ID: ${result.data.order_id}`);
            console.log(`   Payment URL: ${result.data.redirect_url}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
