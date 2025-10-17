const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_KEY);
db.settings({ ignoreUndefinedProperties: true });

// Crear un producto
router.post("/create", async (req, res) => {
  try {
    const { product_name, product_category, product_price, product_quantity, imageURL } = req.body;
    if (!product_name || !product_category || !product_price || !product_quantity) {
      return res.status(400).json({ success: false, msg: "Faltan campos obligatorios" });
    }

    const id = Date.now();
    const data = {
      productId: id,
      product_name,
      product_category,
      product_price,
      product_quantity,
      imageURL,
    };

    const response = await db.collection("products").doc(`${id}`).set(data);
    return res.status(200).json({ success: true, data: response });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// Actualizar un producto
router.put("/update/:productId", async (req, res) => {
  const { productId } = req.params;
  const { product_name, product_category, product_price, product_quantity, imageURL } = req.body;

  if (!product_name || !product_category || !product_price || !product_quantity) {
    return res.status(400).json({ success: false, msg: "Faltan datos necesarios" });
  }

  try {
    const updatedData = {
      product_name,
      product_category,
      product_price,
      product_quantity,
      imageURL,
    };
    await db.collection("products").doc(productId).update(updatedData);
    return res.status(200).json({ success: true, msg: "Producto actualizado con éxito" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// Obtener todos los productos
router.get("/all", async (req, res) => {
  try {
    const query = db.collection("products");
    const querysnap = await query.get();
    const response = querysnap.docs.map(doc => doc.data());
    return res.status(200).json({ success: true, data: response });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// Eliminar un producto
router.delete("/delete/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    await db.collection("products").doc(productId).delete();
    return res.status(200).json({ success: true, msg: "Producto eliminado" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// Crear carrito
router.post("/addToCart/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId, product_name, product_category, product_price, imageURL } = req.body;

  try {
    const itemRef = db.collection("cartItems").doc(userId).collection("items").doc(productId);
    const doc = await itemRef.get();

    if (doc.exists) {
      const quantity = doc.data().quantity + 1;
      await itemRef.update({ quantity });
    } else {
      const data = {
        productId,
        product_name,
        product_category,
        product_price,
        imageURL,
        quantity: 1,
        created: Date.now(),
      };
      await itemRef.set(data);
    }
    const updatedDoc = await itemRef.get();
    return res.status(200).json({ success: true, data: updatedDoc.data() });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error :${err.message}` });
  }
});

// update cart to increase and decrease the quantity
router.post("/updateCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId = req.query.productId;
  const type = req.query.type;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`${userId}`)
      .collection("items")
      .doc(`${productId}`)
      .get();

    if (doc.data()) {
      if (type === "increment") {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection("cartItems")
          .doc(`${userId}`)
          .collection("items")
          .doc(`${productId}`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        if (doc.data().quantity === 1) {
          await db
            .collection("cartItems")
            .doc(`${userId}`)
            .collection("items")
            .doc(`${productId}`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const quantity = doc.data().quantity - 1;
          const updatedItem = await db
            .collection("cartItems")
            .doc(`${userId}`)
            .collection("items")
            .doc(`${productId}`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error :${err}` });
  }
});

// get all the cartitems for that user
router.get("/getCartItems/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  (async () => {
    try {
      let query = db
        .collection("cartItems")
        .doc(`${userId}`)
        .collection("items");
      let response = [];

      await query.get().then((querysnap) => {
        let docs = querysnap.docs;

        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (er) {
      return res.send({ success: false, msg: `Error :,${er}` });
    }
  })();
});

// Crear sesión de checkout
router.post("/create-checkout-session", async (req, res) => {
  try {
    const carritoId = Date.now().toString();
    const { user, cart, total } = req.body.data;

    await db.collection("cartPay").doc(carritoId).set({
      user_id: user.user_id,
      items: cart,
      total: total,
      created: Date.now(),
    });

    const customer = await stripe.customers.create({
      metadata: {
        user_id: user.user_id,
        carrito_id: carritoId,
      },
    });

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "cop",
        unit_amount: item.product_price * 100,
        product_data: {
          name: item.product_name,
          images: [item.imageURL],
          metadata: {
            id: item.productId,
          },
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["CO"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "cop" },
            display_name: "Gratis el envio",
            delivery_estimate: {
              minimum: { unit: "hour", value: 2 },
              maximum: { unit: "hour", value: 4 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    res.send({ url: session.url });
  } catch (err) {
    console.error("Error al crear checkout session:", err);
    res
      .status(500)
      .send({ success: false, message: "Error al crear la sesión de pago" });
  }
});

let endpointSecret;
endpointSecret = process.env.WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let eventType;
    let data;

    try {
      if (endpointSecret) {
        let event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
        data = event.data.object;
        eventType = event.type;
      } else {
        data = req.body.data.object;
        eventType = req.body.type;
      }

      // Validar los campos de producto cuando recibimos el evento
      console.log("holaaaa",data.line_items,data.line_items.data, data.line_items.data.length);
      
      if (
        !data.line_items ||
        !data.line_items.data ||
        data.line_items.data.length === 0
      ) {
        return res.status(400).send({
          success: false,
          msg: "Faltan datos requeridos para los productos",
        });
      }

      // Si el evento es de sesión completada
      if (eventType === "checkout.session.completed") {
        try {
          const customer = await stripe.customers.retrieve(data.customer);
          await createOrder(customer, data);
          return res.status(200).send({ received: true });
        } catch (error) {
          console.error("Error en webhook al crear orden:", error);
          return res.status(500).send({ success: false });
        }
      }

      return res.status(200).send({ received: true });
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

const createOrder = async (customer, intent) => {
  try {
    const carritoId = customer.metadata.carrito_id;

    const carritoDoc = await db.collection("cartPay").doc(carritoId).get();
    if (!carritoDoc.exists) {
      console.error("Carrito no encontrado:", carritoId);
      return;
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
    await deleteCart(carritoData.user_id, carritoData.items);
    await db.collection("cartPay").doc(carritoId).delete();

    console.log("Orden creada exitosamente");
  } catch (err) {
    console.error("Error al crear la orden:", err);
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

// orders
router.get("/orders", async (req, res) => {
  try {
    let query = db.collection("orders");
    let response = [];
    const querysnap = await query.get();
    querysnap.docs.forEach((doc) => {
      response.push({ ...doc.data() });
    });
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.send({ success: false, msg: `Error :${err}` });
  }
});

// update the order status
router.post("/updateOrder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const sts = req.query.sts;

  try {
    const updatedItem = await db
      .collection("orders")
      .doc(order_id)
      .update({ sts });
    return res.status(200).send({ success: true, data: updatedItem });
  } catch (er) {
    return res.send({ success: false, msg: `Error :,${er}` });
  }
});

module.exports = router;
