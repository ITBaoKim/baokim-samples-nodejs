/**
 * Ví dụ 3: Tra Cứu Đơn Hàng
 */

const { Config, BaokimAuth, BaokimOrder, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Tra Cứu Đơn Hàng ===\n');

    // Lấy mã đơn hàng từ command line
    const mrcOrderId = process.argv[2] || 'YOUR_ORDER_ID';

    console.log(`Mã đơn hàng tra cứu: ${mrcOrderId}`);
    console.log('(Truyền mã đơn qua command line: node 03_query_order.js YOUR_ORDER_ID)\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        console.log('Đang gọi API tra cứu...\n');

        const result = await orderService.queryOrder(mrcOrderId);

        console.log('=== Kết quả ===');
        console.log(`Success: ${result.success ? 'TRUE' : 'FALSE'}`);
        console.log(`Code: ${result.code} - ${ErrorCode.getMessage(result.code)}`);
        console.log(`Message: ${result.message}\n`);

        if (result.success && result.data) {
            const order = result.data.order;
            console.log('=== Thông tin đơn hàng ===');
            console.log(`Mã đơn BK: ${order.id}`);
            console.log(`Mã đơn MRC: ${order.mrc_order_id}`);
            console.log(`Số tiền: ${parseInt(order.total_amount).toLocaleString()} VND`);
            console.log(`Trạng thái: ${order.status == 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}`);
            console.log(`Ngày tạo: ${order.created_at}\n`);

            if (result.data.transactions && result.data.transactions.length > 0) {
                console.log('=== Danh sách giao dịch ===');
                result.data.transactions.forEach((tx, i) => {
                    console.log(`--- Giao dịch ${i + 1} ---`);
                    console.log(`Mã GD: ${tx.id}`);
                    console.log(`Số tiền: ${parseInt(tx.amount).toLocaleString()} VND`);
                    console.log(`Trạng thái: ${tx.status == 1 ? 'Thành công' : 'Chờ xử lý'}`);
                });
            }
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
