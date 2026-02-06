/**
 * Example: Tra cứu giao dịch VA
 */

const { Config, BaokimAuth, BaokimVA } = require('../../src');

async function main() {
    const vaNumber = process.argv[2];

    if (!vaNumber) {
        console.log('Usage: node 03_query_va.js <va_number>');
        return;
    }

    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        const result = await vaService.queryTransaction({ accNo: vaNumber });

        if (result.success) {
            console.log('✅ Tra cứu VA thành công!');
            console.log(`   VA: ${result.data.va_info.acc_no}`);
            console.log(`   Bank: ${result.data.va_info.bank_name}`);
            console.log(`   Transactions: ${result.data.transactions.length}`);
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
