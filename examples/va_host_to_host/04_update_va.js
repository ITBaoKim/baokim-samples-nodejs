/**
 * Example: Cập nhật VA
 */

const { Config, BaokimAuth, BaokimVA } = require('../../src');

async function main() {
    const vaNumber = process.argv[2];

    if (!vaNumber) {
        console.log('Usage: node 04_update_va.js <va_number>');
        return;
    }

    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        // Ví dụ: cập nhật tên và số tiền collect
        const updateData = {
            acc_name: 'NGUYEN VAN A (Updated)',
            collect_amount_min: 50000,
            collect_amount_max: 5000000,
        };

        const result = await vaService.updateVA(vaNumber, updateData);

        if (result.success) {
            console.log('✅ Cập nhật VA thành công!');
            console.log(`   VA Number: ${vaNumber}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
