# Baokim B2B API - Node.js 18 Example 

Bộ source code mẫu tích hợp Baokim B2B API, viết bằng Node.js 18+ (sử dụng native fetch).

## 🔧 Yêu cầu
- Node.js 18+

## 📦 Cài đặt

```bash
git clone https://github.com/Mulligan1499/baokim-b2b-nodejs-example.git
cd baokim-b2b-nodejs-example
cp config/config.js config/config.local.js
```

Chỉnh sửa `config/config.local.js` với thông tin Baokim cung cấp:
- `clientId`, `clientSecret` - Thông tin OAuth2
- `merchantCode`, `masterMerchantCode`, `subMerchantCode`
- `directClientId`, `directClientSecret`, `directMerchantCode` - Cho Direct connection
- Đặt file `merchant_private.pem` vào thư mục `keys/`

## 🚀 Quick Start

```bash
# Test tất cả APIs
node test_full_flow.js

# Test từng loại connection
node test_full_flow.js basic_pro
node test_full_flow.js host_to_host
node test_full_flow.js direct
```

---

## 📖 Hướng dẫn sử dụng

### Bước 1: Import modules
```javascript
const { Config, BaokimAuth, BaokimOrder, BaokimVA, BaokimDirect } = require('./src');

// Load config
Config.load();
```

### Bước 2: Khởi tạo Authentication
```javascript
// Lấy token (tự động cache, không cần gọi lại)
const auth = new BaokimAuth();
const token = await auth.getToken();
```

---

## 🔷 Basic/Pro - Thanh toán qua Master/Sub Merchant

**Class:** `BaokimOrder` (trong `src/MasterSub/BaokimOrder.js`)

### Tạo đơn hàng
```javascript
const orderService = new BaokimOrder(auth);

const result = await orderService.createOrder({
    mrcOrderId: 'ORDER_' + Date.now(),      // Mã đơn hàng của bạn (bắt buộc)
    totalAmount: 100000,                     // Số tiền (bắt buộc)
    description: 'Thanh toán đơn hàng',      // Mô tả (bắt buộc)
    paymentMethod: 1,                        // 1=VA, 6=VNPay QR (tùy chọn)
    customerInfo: BaokimOrder.buildCustomerInfo(
        'NGUYEN VAN A', 'email@example.com', '0901234567', '123 Street'
    ),
});

if (result.success) {
    const paymentUrl = result.data.redirect_url;
    console.log(`Chuyển khách hàng đến: ${paymentUrl}`);
}
```

### Tra cứu đơn hàng
```javascript
const result = await orderService.queryOrder('ORDER_123456');
```

### Hoàn tiền
```javascript
const result = await orderService.refundOrder('ORDER_123456', 50000, 'Hoàn tiền cho khách');
```

### Thu hộ tự động (Auto Debit)
```javascript
const result = await orderService.createOrder({
    mrcOrderId: 'AD_' + Date.now(),
    totalAmount: 0,
    description: 'Thu hộ tự động',
    paymentMethod: BaokimOrder.PAYMENT_METHOD_AUTO_DEBIT,
    serviceCode: 'QL_THU_HO_1',
    customerInfo: { name: 'NGUYEN VAN A', email: 'test@example.com', phone: '0901234567', address: '123 Street', gender: 1 },
});
```

---

## 🔷 Host-to-Host - Virtual Account (VA)

**Class:** `BaokimVA` (trong `src/HostToHost/BaokimVA.js`)

### Tạo VA động (mỗi đơn hàng 1 VA riêng)
```javascript
const vaService = new BaokimVA(auth);

const result = await vaService.createDynamicVA(
    'NGUYEN VAN A',           // Tên khách hàng
    'ORDER_123',              // Mã đơn hàng
    100000                    // Số tiền cần thu
);

if (result.success) {
    console.log(`Số VA: ${result.data.acc_no}`);
    console.log(`Ngân hàng: ${result.data.bank_name}`);
}
```

### Tạo VA tĩnh (1 VA dùng nhiều lần)
```javascript
const result = await vaService.createStaticVA(
    'TRAN VAN B',                    // Tên khách hàng
    'CUSTOMER_001',                  // Mã định danh khách
    '2026-12-31 23:59:59',           // Ngày hết hạn
    10000,                           // Số tiền tối thiểu
    10000000                         // Số tiền tối đa
);
```

### Tra cứu giao dịch VA
```javascript
const result = await vaService.queryTransaction({
    accNo: '00812345678901',    // Số VA
});
```

---

## 🔷 Direct Connection - Không qua Master Merchant

**Class:** `BaokimDirect` (trong `src/Direct/BaokimDirect.js`)

> ⚠️ Direct connection cần credentials riêng, cấu hình trong `directClientId`, `directClientSecret`, `directMerchantCode`

### Khởi tạo với Direct credentials
```javascript
const directAuth = BaokimAuth.forDirectConnection();
const directService = new BaokimDirect(directAuth);
```

### Tạo đơn hàng Direct
```javascript
const result = await directService.createOrder({
    mrcOrderId: 'DRT_' + Date.now(),
    totalAmount: 150000,
    description: 'Thanh toán Direct',
    customerInfo: {
        name: 'NGUYEN VAN A',
        email: 'customer@email.com',
        phone: '0901234567',
        address: '123 Nguyen Hue, HCM',
        gender: 1,
    },
});

if (result.success) {
    console.log(`Payment URL: ${result.data.redirect_url}`);
}
```

### Tra cứu đơn hàng
```javascript
const result = await directService.queryOrder('DRT_123456');
```

### Hủy đơn hàng
```javascript
const result = await directService.cancelOrder('DRT_123456', 'Lý do hủy');
```

---

## 📁 Cấu trúc thư mục

```
├── config/                     # Cấu hình
│   ├── config.js               # Template
│   └── config.local.js         # Config thực (không commit)
├── src/                        # Core modules
│   ├── MasterSub/              # Basic/Pro APIs
│   │   └── BaokimOrder.js
│   ├── HostToHost/             # VA Host-to-Host APIs
│   │   └── BaokimVA.js
│   ├── Direct/                 # Direct Connection APIs
│   │   └── BaokimDirect.js
│   ├── BaokimAuth.js           # Authentication
│   ├── HttpClient.js           # HTTP client
│   ├── SignatureHelper.js      # RSA signing
│   └── index.js                # Main exports
├── examples/                   # Ví dụ từng API
│   ├── basic_pro/
│   ├── va_host_to_host/
│   └── direct/
├── keys/                       # RSA Keys
│   └── merchant_private.pem    # Private key của bạn
├── logs/                       # Log files
└── test_full_flow.js           # Test tất cả APIs
```

## 📚 API Endpoints

### Basic Pro (Master/Sub)
| API | Endpoint |
|-----|----------|
| Tạo đơn | `/b2b/core/api/ext/mm/order/send` |
| Tra cứu | `/b2b/core/api/ext/mm/order/get-order` |
| Hoàn tiền | `/b2b/core/api/ext/mm/refund/send` |

### VA Host to Host
| API | Endpoint |
|-----|----------|
| Tạo VA | `/b2b/core/api/ext/mm/bank-transfer/create` |
| Cập nhật VA | `/b2b/core/api/ext/mm/bank-transfer/update` |
| Tra cứu VA | `/b2b/core/api/ext/mm/bank-transfer/detail` |

### Direct Connection
| API | Endpoint |
|-----|----------|
| Tạo đơn | `/b2b/core/api/ext/order/send` |
| Tra cứu | `/b2b/core/api/ext/order/get-order` |
| Hủy đơn | `/b2b/core/api/ext/order/cancel` |

---

## ❓ Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `Chữ ký số không hợp lệ` | Private key không đúng | Kiểm tra file `keys/merchant_private.pem` |
| `Token expired` | Token hết hạn | SDK tự động refresh, không cần xử lý |
| `Invalid merchant_code` | Sai mã merchant | Kiểm tra config |

---
© 2026 Baokim
