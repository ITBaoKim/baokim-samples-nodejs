/**
 * Example: Tạo đơn thu hộ tự động (Auto Debit)
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        const mrcOrderId = `TT${Date.now()}`;

        const result = await orderService.createOrder({
            mrcOrderId,
            totalAmount: 0,
            description: `Don hang Test ${mrcOrderId}`,
            paymentMethod: BaokimOrder.PAYMENT_METHOD.AUTO_DEBIT,
            serviceCode: 'QL_THU_HO_1',
            saveToken: 0,
            items: [{
                code: 'PROD001',
                name: 'San pham A',
                amount: 0,
                quantity: 1,
                link: 'https://example.com/product-a',
            }],
            customerInfo: {
                code: 'KH01',
                name: 'AUTOMATION TEST',
                email: 'test@example.com',
                phone: '0911830977',
                address: '123 Nguyen Trai, Hanoi',
                gender: 1,
            },
        });

        if (result.success) {
            console.log('✅ Tạo đơn thu hộ thành công!');
            console.log(`   Order ID: ${result.data.order_id}`);
            console.log(`   Redirect URL: ${result.data.redirect_url}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
