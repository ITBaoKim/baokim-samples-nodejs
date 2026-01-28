/**
 * Ví dụ 7: Tra cứu giao dịch VA
 */

const { Config, BaokimAuth, BaokimVA, ErrorCode } = require('../../src');

async function main() {
    console.log('=== Baokim B2B - Tra Cứu Giao Dịch VA ===\n');

    // Lấy params từ command line
    const accNo = process.argv[2] || null;
    const mrcOrderId = process.argv[3] || null;

    try {
        Config.load();

        const auth = new BaokimAuth();
        const vaService = new BaokimVA(auth);

        // ==== Tra cứu theo số VA ====
        if (accNo) {
            console.log(`=== Tra cứu theo số VA: ${accNo} ===\n`);
            console.log('Đang tra cứu...');

            const result = await vaService.queryTransaction({ accNo });

            console.log(`\nSuccess: ${result.success ? 'TRUE' : 'FALSE'}`);
            console.log(`Code: ${result.code}\n`);

            if (result.success && result.data) {
                console.log('=== Thông tin VA ===');
                const vaInfo = result.data.va_info;
                console.log(`Số VA: ${vaInfo.acc_no}`);
                console.log(`Ngân hàng: ${vaInfo.bank_name}`);
                console.log(`Tên TK: ${vaInfo.acc_name}`);
                console.log(`QR: ${vaInfo.qr_path}\n`);

                console.log('=== Danh sách giao dịch ===');
                if (result.data.transactions.length > 0) {
                    result.data.transactions.forEach((tx, i) => {
                        console.log(`--- Giao dịch ${i + 1} ---`);
                        console.log(`   ID: ${tx.id}`);
                        console.log(`   Số tiền: ${parseInt(tx.amount).toLocaleString()} VND`);
                        console.log(`   Trạng thái: ${tx.status == 1 ? 'Thành công' : 'Chờ xử lý'}`);
                        console.log(`   Thời gian: ${tx.created_at}`);
                    });
                } else {
                    console.log('Chưa có giao dịch');
                }
            }
        } else {
            console.log('Sử dụng:');
            console.log('   node 07_query_transaction.js VA_NUMBER');
            console.log('   node 07_query_transaction.js VA_NUMBER ORDER_ID');
        }

        console.log('\n=== HOÀN THÀNH ===');

    } catch (error) {
        console.error('\n!!! LỖI !!!');
        console.error(`Message: ${error.message}`);
    }
}

main();
