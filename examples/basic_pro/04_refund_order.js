/**
 * Ví dụ 4: Hoàn Tiền Đơn Hàng
 */

const { Config, BaokimAuth, BaokimOrder, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Hoàn Tiền Đơn Hàng ===\n');

    // Lấy params từ command line
    const mrcOrderId = process.argv[2] || 'YOUR_ORDER_ID';
    const amount = parseInt(process.argv[3]) || 0;
    const reason = process.argv[4] || 'Hoan tien theo yeu cau';

    console.log(`Mã đơn hàng: ${mrcOrderId}`);
    console.log(`Số tiền hoàn: ${amount > 0 ? amount.toLocaleString() + ' VND' : 'Toàn bộ'}`);
    console.log(`Lý do: ${reason}\n`);
    console.log('(Sử dụng: node 04_refund_order.js ORDER_ID AMOUNT "REASON")\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        console.log('Đang gọi API hoàn tiền...\n');

        const result = await orderService.refundOrder(mrcOrderId, amount, reason);

        console.log('=== Kết quả ===');
        console.log(`Success: ${result.success ? 'TRUE' : 'FALSE'}`);
        console.log(`Code: ${result.code} - ${ErrorCode.getMessage(result.code)}`);
        console.log(`Message: ${result.message}\n`);

        if (result.success) {
            console.log('✓ Hoàn tiền thành công!');
        } else {
            console.log('✗ Hoàn tiền thất bại!');
            console.log('Vui lòng kiểm tra lại mã đơn hàng và trạng thái đơn.');
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
