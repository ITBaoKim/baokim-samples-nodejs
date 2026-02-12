/**
 * Example: Tạo Dynamic VA
 */

const { Config, BaokimAuth, BaokimVA } = require('../../src');

async function main() {
    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        const mrcOrderId = `DYNVA_${Date.now()}`;

        const result = await vaService.createDynamicVA(
            'NGUYEN VAN A',
            mrcOrderId,
            100000
        );

        if (result.success) {
            console.log('✅ Tạo Dynamic VA thành công!');
            console.log(`   VA Number: ${result.data.acc_no}`);
            console.log(`   Bank: ${result.data.bank_name}`);
            console.log(`   Account Name: ${result.data.acc_name}`);
            console.log(`   QR: ${result.data.qr_path}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
