/**
 * Ví dụ 5: Hủy Thu Hộ Tự Động
 */

const { Config, BaokimAuth, BaokimOrder, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Hủy Thu Hộ Tự Động ===\n');

    // Token từ webhook khi đăng ký thu hộ tự động thành công
    const autoDebitToken = process.argv[2] || 'YOUR_AUTO_DEBIT_TOKEN';

    console.log(`Token thu hộ tự động: ${autoDebitToken}`);
    console.log('(Sử dụng: node 05_cancel_auto_debit.js YOUR_TOKEN)\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        console.log('Đang gọi API hủy thu hộ tự động...\n');

        const result = await orderService.cancelAutoDebit(autoDebitToken);

        console.log('=== Kết quả ===');
        console.log(`Success: ${result.success ? 'TRUE' : 'FALSE'}`);
        console.log(`Code: ${result.code} - ${ErrorCode.getMessage(result.code)}`);
        console.log(`Message: ${result.message}\n`);

        if (result.success) {
            console.log('✓ Hủy thu hộ tự động thành công!');
            if (result.data) {
                console.log('\nChi tiết:');
                console.log(JSON.stringify(result.data, null, 2));
            }
        } else {
            console.log('✗ Hủy thu hộ tự động thất bại!');
            console.log('Vui lòng kiểm tra lại token.');
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
