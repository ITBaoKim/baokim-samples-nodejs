/**
 * Ví dụ 2: Tạo Đơn Hàng
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Tạo Đơn Hàng ===\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        // Tạo mã đơn hàng unique
        const mrcOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
        const amount = 350000;

        console.log('1. Chuẩn bị dữ liệu đơn hàng');
        console.log(`   Mã đơn hàng: ${mrcOrderId}`);
        console.log(`   Tổng tiền: ${amount.toLocaleString()} VND\n`);

        console.log('2. Đang gọi API tạo đơn hàng...');

        const result = await orderService.createOrder({
            mrcOrderId,
            totalAmount: amount,
            description: `Thanh toan don hang ${mrcOrderId}`,
            customerInfo: BaokimOrder.buildCustomerInfo(
                'Nguyen Van A',
                'nguyenvana@email.com',
                '0901234567',
                '123 Nguyen Hue, Q.1'
            ),
        });

        console.log('3. Kết quả:');
        console.log(`   Success: ${result.success ? 'TRUE' : 'FALSE'}`);
        console.log(`   Code: ${result.code}`);
        console.log(`   Message: ${result.message}\n`);

        if (result.success) {
            console.log('=== Thông tin thanh toán ===');
            console.log(`Redirect URL: ${result.data.redirect_url}\n`);
            console.log('Full response data:');
            console.log(JSON.stringify(result.data, null, 2));
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
