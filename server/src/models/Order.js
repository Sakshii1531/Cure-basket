const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      medicine: {
        type: mongoose.Schema.ObjectId,
        ref: 'Medicine',
        required: true
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true
      },
      pkg: {
        label: String,
        units: Number,
      }
    }
  ],
  subtotal: Number,
  shippingFee: Number,
  discountAmount: Number,
  couponCode: String,
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ── Indexes ─────────────────────────────────────────────────────────────────
// User order history (getMyOrders), admin filters, and analytics aggregations.
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
