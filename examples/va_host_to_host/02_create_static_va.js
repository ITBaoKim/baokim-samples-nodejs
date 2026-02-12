/**
 * Example: Tạo Static VA
 */

const { Config, BaokimAuth, BaokimVA } = require('../../src');

async function main() {
    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        const mrcOrderId = `STATVA_${Date.now()}`;

        // Expire date: 30 ngày kể từ bây giờ
        const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const expireDateStr = expireDate.toISOString().replace('T', ' ').substr(0, 19);

        const result = await vaService.createStaticVA(
            'TRAN VAN B',
            mrcOrderId,
            expireDateStr,
            10000,      // Số tiền tối thiểu
            10000000,   // Số tiền tối đa
            'Static VA for recurring payments'
        );

        if (result.success) {
            console.log('✅ Tạo Static VA thành công!');
            console.log(`   VA Number: ${result.data.acc_no}`);
            console.log(`   Bank: ${result.data.bank_name}`);
            console.log(`   Account Name: ${result.data.acc_name}`);
            console.log(`   Expire: ${expireDateStr}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
