/**
 * Example: Tạo đơn hàng Direct Connection
 */

const { Config, BaokimAuth, BaokimDirect } = require('../../src');

async function main() {
    try {
        Config.load();

        // Sử dụng Direct credentials
        const auth = BaokimAuth.forDirectConnection();
        const directService = new BaokimDirect(auth);

        const mrcOrderId = `DRT${new Date().toISOString().replace(/[-:T]/g, '').substr(2, 12)}${Math.floor(Math.random() * 1000)}`;

        const result = await directService.createOrder({
            mrcOrderId,
            totalAmount: 100000,
            description: 'Test Direct Order',
            customerInfo: {
                name: 'NGUYEN VAN A',
                email: 'test@example.com',
                phone: '0901234567',
                address: '123 Test Street',
                gender: 1,
            },
        });

        if (result.success) {
            console.log('✅ Tạo đơn Direct thành công!');
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
