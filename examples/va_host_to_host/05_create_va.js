/**
 * Ví dụ 5: Tạo Virtual Account (VA)
 */

const { Config, BaokimAuth, BaokimVA, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Tạo Virtual Account ===\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        // ==== Ví dụ 1: Tạo Dynamic VA ====
        console.log('=== Ví dụ 1: Tạo Dynamic VA (1 lần dùng) ===\n');

        const dynamicOrderId = `VA_DYN_${Date.now()}`;
        const dynamicAmount = 500000;

        console.log(`Mã đơn hàng: ${dynamicOrderId}`);
        console.log(`Số tiền: ${dynamicAmount.toLocaleString()} VND`);
        console.log('Đang tạo VA...\n');

        const dynamicResult = await vaService.createDynamicVA(
            'NGUYEN VAN A',
            dynamicOrderId,
            dynamicAmount,
            `Thanh toan don hang ${dynamicOrderId}`
        );

        console.log(`Success: ${dynamicResult.success ? 'TRUE' : 'FALSE'}`);
        console.log(`Code: ${dynamicResult.code} - ${ErrorCode.getMessage(dynamicResult.code)}\n`);

        if (dynamicResult.success) {
            console.log('Thông tin VA:');
            console.log(`   VA Number: ${dynamicResult.data.acc_no}`);
            console.log(`   Ngân hàng: ${dynamicResult.data.bank_name}`);
            console.log(`   Tên TK: ${dynamicResult.data.acc_name}`);
            console.log(`   Số tiền: ${parseInt(dynamicResult.data.user_amount).toLocaleString()} VND`);
            console.log(`   Hết hạn: ${dynamicResult.data.expire_date}`);
            console.log(`   QR: ${dynamicResult.data.qr_path}`);
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
