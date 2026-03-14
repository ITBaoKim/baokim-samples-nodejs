/**
 * BaokimMerchantVA - API Virtual Account (Merchant Hosted / Direct Connection)
 * 
 * 
 * Endpoints:
 * - Tạo VA: POST /b2b/core/api/merchant-hosted/bank-transfer/create
 * - Cập nhật VA: POST /b2b/core/api/merchant-hosted/bank-transfer/update
 * - Chi tiết VA: POST /b2b/core/api/merchant-hosted/bank-transfer/detail
 */

const Config = require('../Config');
const HttpClient = require('../HttpClient');
const SignatureHelper = require('../SignatureHelper');
const ErrorCode = require('../ErrorCode');

// Endpoints
const ENDPOINT_CREATE_VA = '/b2b/core/api/merchant-hosted/bank-transfer/create';
const ENDPOINT_UPDATE_VA = '/b2b/core/api/merchant-hosted/bank-transfer/update';
const ENDPOINT_DETAIL_VA = '/b2b/core/api/merchant-hosted/bank-transfer/detail';

// VA Types
const VA_TYPE = {
    DYNAMIC: 1,  // VA động - 1 lần dùng
    STATIC: 2    // VA tĩnh - nhiều lần dùng
};

class BaokimMerchantVA {
    constructor(token) {
        this.token = token;
        this.httpClient = new HttpClient();
    }

    /**
     * Tạo VA mới (Merchant Hosted)
     * @param {object} vaData
     *   - accName (required), accType (required), mrcOrderId (required), collectAmountMax (required)
     *   - collectAmountMin, storeCode, staffCode, bankCode, expireDate, memo (optional)
     * @returns {Promise<object>}
     */
    async createVA(vaData) {
        const requestBody = {
            request_id: this.generateRequestId('MH_VA'),
            request_time: this.formatDateTime(),
            merchant_code: this.getMerchantCode(),
            acc_name: vaData.accName,
            acc_type: parseInt(vaData.accType || VA_TYPE.DYNAMIC),
            mrc_order_id: vaData.mrcOrderId,
            collect_amount_max: parseInt(vaData.collectAmountMax),
        };

        // Optional amount fields
        if (vaData.collectAmountMin !== undefined) {
            requestBody.collect_amount_min = parseInt(vaData.collectAmountMin);
        }

        // Optional merchant fields
        if (vaData.storeCode) {
            requestBody.store_code = vaData.storeCode;
        }
        if (vaData.staffCode) {
            requestBody.staff_code = vaData.staffCode;
        }
        if (vaData.bankCode) {
            requestBody.bank_code = vaData.bankCode;
        }
        if (vaData.expireDate) {
            requestBody.expire_date = vaData.expireDate;
        }
        if (vaData.memo) {
            requestBody.memo = vaData.memo;
        }

        return this.sendRequest(ENDPOINT_CREATE_VA, requestBody);
    }

    /**
     * Tạo Dynamic VA (Merchant Hosted)
     * @param {string} accName - Tên chủ VA
     * @param {string} mrcOrderId - Mã đơn hàng (max 25 ký tự)
     * @param {number} amount - Số tiền cần thu (tối thiểu 2000)
     * @param {string} memo - Ghi chú (optional)
     * @returns {Promise<object>}
     */
    async createDynamicVA(accName, mrcOrderId, amount, memo = '') {
        const vaData = {
            accName,
            mrcOrderId,
            accType: VA_TYPE.DYNAMIC,
            collectAmountMin: amount,
            collectAmountMax: amount,
        };

        if (memo) {
            vaData.memo = memo;
        }

        return this.createVA(vaData);
    }

    /**
     * Tạo Static VA (Merchant Hosted)
     * @param {string} accName - Tên chủ VA
     * @param {string} mrcOrderId - Mã đơn hàng
     * @param {string} expireDate - Ngày hết hạn (YYYY-MM-DD HH:mm:ss)
     * @param {number} collectAmountMax - Số tiền thu tối đa (required)
     * @param {number} collectAmountMin - Số tiền thu tối thiểu (optional)
     * @returns {Promise<object>}
     */
    async createStaticVA(accName, mrcOrderId, expireDate, collectAmountMax, collectAmountMin = null) {
        const vaData = {
            accName,
            mrcOrderId,
            accType: VA_TYPE.STATIC,
            collectAmountMax,
            expireDate,
        };

        if (collectAmountMin !== null) {
            vaData.collectAmountMin = collectAmountMin;
        }

        return this.createVA(vaData);
    }

    /**
     * Cập nhật VA (Merchant Hosted)
     * @param {string} mrcOrderId - Mã đơn hàng (required)
     * @param {object} updateData - { accName?, collectAmountMin?, collectAmountMax?, expireDate? }
     * @returns {Promise<object>}
     */
    async updateVA(mrcOrderId, updateData) {
        const requestBody = {
            request_id: this.generateRequestId('MH_VA_UPD'),
            request_time: this.formatDateTime(),
            merchant_code: this.getMerchantCode(),
            mrc_order_id: mrcOrderId,
        };

        if (updateData.accName) requestBody.acc_name = updateData.accName;
        if (updateData.collectAmountMin !== undefined) requestBody.collect_amount_min = parseInt(updateData.collectAmountMin);
        if (updateData.collectAmountMax !== undefined) requestBody.collect_amount_max = parseInt(updateData.collectAmountMax);
        if (updateData.expireDate) requestBody.expire_date = updateData.expireDate;

        return this.sendRequest(ENDPOINT_UPDATE_VA, requestBody);
    }

    /**
     * Tra cứu chi tiết VA (Merchant Hosted)
     * @param {string} accNo - Số VA cần tra cứu (required)
     * @param {object} queryData - { startDate?, endDate?, currentPage?, perPage? } (all optional)
     * @returns {Promise<object>}
     */
    async detailVA(accNo, queryData = {}) {
        const requestBody = {
            request_id: this.generateRequestId('MH_VA_DTL'),
            request_time: this.formatDateTime(),
            merchant_code: this.getMerchantCode(),
            acc_no: accNo,
        };

        if (queryData.startDate) requestBody.start_date = queryData.startDate;
        if (queryData.endDate) requestBody.end_date = queryData.endDate;
        if (queryData.currentPage !== undefined) requestBody.current_page = parseInt(queryData.currentPage);
        if (queryData.perPage !== undefined) requestBody.per_page = parseInt(queryData.perPage);

        return this.sendRequest(ENDPOINT_DETAIL_VA, requestBody);
    }

    /**
     * Gửi request tới Baokim API (Merchant Hosted dùng Direct Connection auth)
     */
    async sendRequest(endpoint, requestBody) {
        const jsonBody = JSON.stringify(requestBody);
        const signature = SignatureHelper.sign(jsonBody);
        const authHeader = 'Bearer ' + this.token;

        const response = await this.httpClient.postRaw(endpoint, jsonBody, {
            'Authorization': authHeader,
            'Signature': signature
        });

        if (!response.success) {
            throw new Error(`API request failed: ${response.error}`);
        }

        const data = response.data;
        const code = data.code;

        return {
            success: ErrorCode.isSuccess(code),
            code: code,
            message: data.message || '',
            data: data.data || null,
            rawResponse: data,
        };
    }

    /**
     * Lấy merchant code cho Merchant Hosted
     */
    getMerchantCode() {
        return Config.get('directMerchantCode') || Config.get('merchantCode');
    }

    /**
     * Generate unique request ID
     * Note: Baokim dùng merchant_code trong request_id để thống kê và gửi thông báo cập nhật SDK.
     * Vui lòng giữ nguyên format này.
     */
    generateRequestId(prefix = 'MH_VA') {
        const merchantCode = this.getMerchantCode();
        return `${merchantCode}_${prefix}_${this.formatDateTime().replace(/[- :]/g, '')}_${Math.random().toString(16).substr(2, 8)}`;
    }

    /**
     * Format datetime (Vietnam timezone +07:00)
     */
    formatDateTime() {
        const now = new Date();
        const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        return vnTime.toISOString().replace('T', ' ').substr(0, 19);
    }
}

// Export VA types
BaokimMerchantVA.VA_TYPE = VA_TYPE;

module.exports = BaokimMerchantVA;
