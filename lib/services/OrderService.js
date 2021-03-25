const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }
  static async updateById(id,{quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order update: Quantity changed to ${quantity}`
    );

    const order = await Order.insert({ id, quantity });

    return order;
  }
  static async delete(id,{quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order update: Order of quantity=${quantity} has been deleted.`
    );

    const order = await Order.insert({ id, quantity });

    return order;
  }
};
