/**
 * Ví dụ 6: Cập nhật Virtual Account
 */

const { Config, BaokimAuth, BaokimVA, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Cập nhật Virtual Account ===\n');

    // Lấy số VA từ command line
    const accNo = process.argv[2] || 'YOUR_VA_NUMBER';

    console.log(`Số VA cần cập nhật: ${accNo}`);
    console.log('(Sử dụng: node 06_update_va.js VA_NUMBER)\n');

    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        console.log('Đang gọi API cập nhật VA...\n');

        const result = await vaService.updateVA(accNo, {
            acc_name: 'NGUYEN VAN B',
            collect_amount_min: 200000,
            collect_amount_max: 200000,
            description: 'Updated VA',
        });

        console.log('=== Kết quả ===');
        console.log(`Success: ${result.success ? 'TRUE' : 'FALSE'}`);
        console.log(`Code: ${result.code} - ${ErrorCode.getMessage(result.code)}`);
        console.log(`Message: ${result.message}\n`);

        if (result.success) {
            console.log('✓ Cập nhật VA thành công!');
            if (result.data) {
                console.log('\nThông tin VA sau khi cập nhật:');
                console.log(JSON.stringify(result.data, null, 2));
            }
        } else {
            console.log('✗ Cập nhật VA thất bại!');
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
