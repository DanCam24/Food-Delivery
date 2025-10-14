// routes/webhook.js
const express = require("express");
const Stripe = require("stripe");
const { db } = require("..");
const stripe = new Stripe(process.env.STRIPE_KEY); // Asegúrate de que esta clave esté definida en tu .env
const router = express.Router();

let endpointSecret = process.env.WEBHOOK_SECRET;

// Middleware para procesar el webhook
router.post(
  "/",
  express.raw({ type: "application/json" }), // Para Stripe, el webhook debe estar en formato raw
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let eventType;
    let data;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Aquí puedes manejar los distintos tipos de eventos de Stripe
    if (eventType === "checkout.session.completed") {
      stripe.customers.retrieve(data.customer).then((customer) => {
        createOrder(customer, data, res);
      });
    } else {
      res.send().end();
    }
  }
);

const createOrder = async (customer, intent, res) => {
  try {
    const carritoId = customer.metadata.carrito_id;

    const carritoDoc = await db.collection("cartPay").doc(carritoId).get();
    if (!carritoDoc.exists) {
      console.error("Carrito no encontrado:", carritoId);
      return res
        .status(400)
        .send({ success: false, msg: "Carrito no encontrado" });
    }

    const carritoData = carritoDoc.data();
    const orderId = Date.now();

    const orderData = {
      intentId: intent.id,
      orderId: orderId,
      amount: intent.amount_total,
      created: intent.created,
      payment_method_types: intent.payment_method_types,
      status: intent.payment_status,
      customer: intent.customer_details,
      shipping_details: intent.shipping_details,
      userId: carritoData.user_id,
      items: carritoData.items,
      total: carritoData.total,
      sts: "empacando",
    };

    await db.collection("orders").doc(`${orderId}`).set(orderData);
    deleteCart(carritoData.user_id, carritoData.items);
    await db.collection("cartPay").doc(carritoId).delete();

    console.log("Orden creada exitosamente");
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error("Error al crear la orden:", err);
    return res
      .status(500)
      .send({ success: false, message: "Error al crear la orden" });
  }
};

const deleteCart = async (userId, items) => {
  for (const data of items) {
    try {
      await db
        .collection("cartItems")
        .doc(`${userId}`)
        .collection("items")
        .doc(`${data.productId}`)
        .delete();
      console.log(
        `Item ${data.productId} eliminado del carrito de usuario ${userId}`
      );
    } catch (error) {
      console.error(
        `Error eliminando item ${data.productId} del carrito de usuario ${userId}`,
        error
      );
    }
  }
};

module.exports = router;
