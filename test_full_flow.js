/**
 * Test Full API Flow - Baokim B2B Node.js
 * 
 * Unified test script supporting multiple connection types:
 * - basic_pro: MasterSub Order APIs (Create, Query, Refund, Auto Debit)
 * - host_to_host: VA APIs (Create Dynamic/Static VA, Update, Query)
 * - direct: Direct Order APIs (Create, Query, Cancel)
 * 
 * Usage:
 *   node test_full_flow.js [connection_type]
 * 
 * Examples:
 *   node test_full_flow.js                    # Run all tests
 *   node test_full_flow.js basic_pro          # Test Basic/Pro only
 *   node test_full_flow.js host_to_host       # Test Host-to-Host only
 *   node test_full_flow.js direct             # Test Direct only
 */

const { Config, BaokimAuth, BaokimOrder, BaokimVA, BaokimDirect } = require('./src');

// Parse CLI arguments
const connectionType = (process.argv[2] || 'all').toLowerCase();
const validTypes = ['all', 'basic_pro', 'host_to_host', 'direct'];

if (!validTypes.includes(connectionType)) {
    console.log(`❌ Invalid connection type: ${connectionType}\n`);
    console.log('Usage: node test_full_flow.js [connection_type]\n');
    console.log('Valid types:');
    console.log('  all          - Run all tests (default)');
    console.log('  basic_pro    - Test MasterSub Order APIs');
    console.log('  host_to_host - Test Host-to-Host VA APIs');
    console.log('  direct       - Test Direct Order APIs');
    process.exit(1);
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║       BAOKIM B2B API - FULL TEST FLOW (Node.js)          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const results = {
        basic_pro: {},
        host_to_host: {},
        direct: {},
    };

    try {
        Config.load();

        console.log(`📌 Environment: ${Config.get('baseUrl')}`);
        console.log(`📌 Connection Type: ${connectionType.toUpperCase()}\n`);

        // Get Token (shared)
        const auth = new BaokimAuth();
        const token = await auth.getToken();
        console.log('✅ Token acquired successfully\n');

        // ============================================================
        // BASIC/PRO TESTS
        // ============================================================
        if (connectionType === 'all' || connectionType === 'basic_pro') {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔷 BASIC/PRO (MasterSub) TESTS');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            const orderService = new BaokimOrder(auth);
            const mrcOrderId = 'TEST_' + Date.now() + '_' + Math.floor(Math.random() * 9999);

            // Create Order
            const orderResult = await orderService.createOrder({
                mrcOrderId: mrcOrderId,
                totalAmount: 100000,
                description: 'Test order ' + mrcOrderId,
                customerInfo: BaokimOrder.buildCustomerInfo('NGUYEN VAN A', 'test@example.com', '0901234567', '123 Test Street'),
            });
            results.basic_pro.create_order = orderResult.success;
            console.log(`   Create Order: ${orderResult.success ? `✅ ${mrcOrderId}` : `❌ ${orderResult.message}`}`);

            // Query Order
            const queryResult = await orderService.queryOrder(mrcOrderId);
            results.basic_pro.query_order = queryResult.success;
            console.log(`   Query Order: ${queryResult.success ? '✅' : `❌ ${queryResult.message}`}`);

            // Auto Debit Order
            const autoDebitOrderId = 'TT' + Date.now();
            const autoDebitResult = await orderService.createOrder({
                mrcOrderId: autoDebitOrderId,
                totalAmount: 0,
                description: 'Auto debit ' + autoDebitOrderId,
                paymentMethod: BaokimOrder.PAYMENT_METHOD_AUTO_DEBIT,
                serviceCode: 'QL_THU_HO_1',
                customerInfo: { name: 'NGUYEN VAN A', email: 'test@example.com', phone: '0901234567', address: '123 Test Street', gender: 1 },
            });
            results.basic_pro.auto_debit = autoDebitResult.success;
            console.log(`   Auto Debit: ${autoDebitResult.success ? `✅ ${autoDebitOrderId}` : `❌ ${autoDebitResult.message}`}\n`);
        }

        // ============================================================
        // HOST-TO-HOST TESTS
        // ============================================================
        if (connectionType === 'all' || connectionType === 'host_to_host') {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔷 HOST-TO-HOST (VA) TESTS');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            const vaService = new BaokimVA(auth);

            // Create Dynamic VA
            const vaOrderId = 'DVA' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 999);
            const vaResult = await vaService.createDynamicVA('NGUYEN VAN A', vaOrderId, 100000);
            results.host_to_host.dynamic_va = vaResult.success;
            const vaNumber = vaResult.success ? vaResult.data.acc_no : null;
            console.log(`   Dynamic VA: ${vaResult.success ? `✅ ${vaNumber}` : `❌ ${vaResult.message}`}`);

            // Create Static VA
            const staticOrderId = 'SVA' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 999);
            const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
            const staticResult = await vaService.createStaticVA('TRAN VAN B', staticOrderId, expireDate, 10000, 10000000);
            results.host_to_host.static_va = staticResult.success;
            const staticVaNumber = staticResult.success ? staticResult.data.acc_no : null;
            console.log(`   Static VA: ${staticResult.success ? `✅ ${staticVaNumber}` : `❌ ${staticResult.message}`}`);

            // Query VA
            if (vaNumber) {
                const queryVaResult = await vaService.queryTransaction({ accNo: vaNumber });
                results.host_to_host.query_va = queryVaResult.success;
                console.log(`   Query VA: ${queryVaResult.success ? '✅' : `❌ ${queryVaResult.message}`}\n`);
            } else {
                results.host_to_host.query_va = false;
                console.log('   Query VA: ⏭️ Skipped\n');
            }
        }

        // ============================================================
        // DIRECT TESTS
        // ============================================================
        if (connectionType === 'all' || connectionType === 'direct') {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔷 DIRECT CONNECTION TESTS');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Direct connection uses different credentials
            const directAuth = BaokimAuth.forDirectConnection();
            const directService = new BaokimDirect(directAuth);
            const directOrderId = 'DRT' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 999);

            // Create Order
            const directOrderResult = await directService.createOrder({
                mrcOrderId: directOrderId,
                totalAmount: 100000,
                description: 'Direct order ' + directOrderId,
                customerInfo: BaokimDirect.buildCustomerInfo('NGUYEN VAN A', 'test@example.com', '0901234567', '123 Test Street'),
            });
            results.direct.create_order = directOrderResult.success;
            console.log(`   Create Order: ${directOrderResult.success ? `✅ ${directOrderId}` : `❌ ${directOrderResult.message}`}`);

            // Query Order
            const directQueryResult = await directService.queryOrder(directOrderId);
            results.direct.query_order = directQueryResult.success;
            console.log(`   Query Order: ${directQueryResult.success ? '✅' : `❌ ${directQueryResult.message}`}`);

            // Cancel Order (create new order then cancel)
            const cancelOrderId = 'CXL' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 999);
            const cancelCreateResult = await directService.createOrder({
                mrcOrderId: cancelOrderId,
                totalAmount: 50000,
                description: 'Order to cancel',
                customerInfo: BaokimDirect.buildCustomerInfo('TRAN VAN B', 'cancel@example.com', '0901234567', '456 Cancel Street'),
            });
            if (cancelCreateResult.success) {
                const cancelResult = await directService.cancelOrder(cancelOrderId);
                results.direct.cancel_order = cancelResult.success;
                console.log(`   Cancel Order: ${cancelResult.success ? '✅' : `❌ ${cancelResult.message}`}\n`);
            } else {
                results.direct.cancel_order = false;
                console.log('   Cancel Order: ❌ Could not create order\n');
            }
        }

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║                    TEST COMPLETED                        ║');
        console.log('╚══════════════════════════════════════════════════════════╝\n');

        console.log('📋 Summary:');

        if (connectionType === 'all' || connectionType === 'basic_pro') {
            console.log('\n   🔷 BASIC/PRO:');
            for (const [test, success] of Object.entries(results.basic_pro)) {
                const testName = test.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                console.log(`      ${testName}: ${success ? '✅' : '❌'}`);
            }
        }

        if (connectionType === 'all' || connectionType === 'host_to_host') {
            console.log('\n   🔷 HOST-TO-HOST:');
            for (const [test, success] of Object.entries(results.host_to_host)) {
                const testName = test.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                console.log(`      ${testName}: ${success ? '✅' : '❌'}`);
            }
        }

        if (connectionType === 'all' || connectionType === 'direct') {
            console.log('\n   🔷 DIRECT:');
            for (const [test, success] of Object.entries(results.direct)) {
                const testName = test.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                console.log(`      ${testName}: ${success ? '✅' : '❌'}`);
            }
        }

        console.log(`\n📁 Log file: logs/api_${new Date().toISOString().slice(0, 10)}.log`);

    } catch (e) {
        console.error(`\n❌ EXCEPTION: ${e.message}`);
        console.error(e.stack);
    }
}

main();
