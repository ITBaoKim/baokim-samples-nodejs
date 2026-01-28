# Baokim B2B API - Node.js 18 Example

Bộ source code mẫu tích hợp Baokim B2B API, viết bằng Node.js 18 (native fetch, không dependencies).

## 🔧 Yêu cầu
- Node.js 18.0+

## 📦 Cài đặt

```bash
git clone https://github.com/Mulligan1499/baokim-b2b-nodejs18-example.git
cd nodejs18-b2b-example
cp config/config.js config/config.local.js
# Chỉnh sửa config.local.js với thông tin thực
```

## 🚀 Quick Start

```bash
# Test tất cả APIs
node test_full_flow.js

# Test với refund
node test_full_flow.js ORDER_ID AMOUNT
```

## 📁 Cấu trúc

```
├── config/                     # Cấu hình
├── src/                        # Core modules
├── examples/
│   ├── basic_pro/
│   │   ├── 01_get_token.js
│   │   ├── 02_create_order.js
│   │   ├── 03_query_order.js
│   │   ├── 04_refund_order.js
│   │   └── 05_cancel_auto_debit.js
│   ├── va_host_to_host/
│   │   ├── 05_create_va.js
│   │   ├── 06_update_va.js
│   │   └── 07_query_transaction.js
│   └── webhook_receiver.js
├── keys/                       # RSA Keys
├── logs/                       # Log files
└── test_full_flow.js           # Test tất cả APIs
```

## 📚 APIs

### Basic Pro
| API | Endpoint |
|-----|----------|
| Lấy Token | `/b2b/auth-service/api/oauth/get-token` |
| Tạo đơn | `/b2b/core/api/ext/mm/order/send` |
| Tra cứu | `/b2b/core/api/ext/mm/order/get-order` |
| Hoàn tiền | `/b2b/core/api/ext/mm/refund/send` |
| Hủy thu hộ | `/b2b/core/api/ext/mm/autodebit/cancel` |

### VA Host to Host
| API | Endpoint |
|-----|----------|
| Tạo VA | `/b2b/core/api/ext/mm/bank-transfer/create` |
| Cập nhật VA | `/b2b/core/api/ext/mm/bank-transfer/update` |
| Tra cứu VA | `/b2b/core/api/ext/mm/bank-transfer/detail` |

## 🖥️ Replit

Import repo → Tạo `config/config.local.js` → Tạo `keys/merchant_private.pem` → Run

---
© 2026 Baokim
