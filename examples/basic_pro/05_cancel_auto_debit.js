/**
 * Example: Hủy thu hộ tự động (Cancel Auto Debit)
 */

const { Config, BaokimAuth, BaokimOrder } = require('../../src');

async function main() {
    const autoDebitToken = process.argv[2];

    if (!autoDebitToken) {
        console.log('Usage: node 05_cancel_auto_debit.js <auto_debit_token>');
        console.log('Note: Token is received from webhook after customer setup auto debit');
        return;
    }

    try {
        Config.load();

        const auth = new BaokimAuth();
        const orderService = new BaokimOrder(auth);

        const result = await orderService.cancelAutoDebit(autoDebitToken);

        if (result.success) {
            console.log('✅ Hủy thu hộ tự động thành công!');
        } else {
            console.log(`❌ Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
