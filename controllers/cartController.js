const pool = require('../database');

exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await pool.query(
            'SELECT C.id, C.id_libro, L.titulo, L.precio, C.cantidad FROM Carrito C JOIN libros L ON C.id_libro = L.id WHERE C.id_usuario = ?',
            [userId]
        );
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los elementos del carrito');
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const [existingProduct] = await pool.query('SELECT * FROM Carrito WHERE id_usuario = ? AND id_libro = ?', [userId, productId]);

        if (existingProduct) {
            await pool.query('UPDATE Carrito SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_libro = ?', [userId, productId]);
        } else {
            await pool.query('INSERT INTO Carrito (id_usuario, id_libro, cantidad) VALUES (?, ?, 1)', [userId, productId]);
        }

        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    try {
        const [existingProduct] = await pool.query('SELECT * FROM Carrito WHERE id_usuario = ? AND id_libro = ?', [userId, productId]);

        if (existingProduct) {
            if (existingProduct.cantidad > 1) {
                await pool.query('UPDATE Carrito SET cantidad = cantidad - 1 WHERE id_usuario = ? AND id_libro = ?', [userId, productId]);
            } else {
                await pool.query('DELETE FROM Carrito WHERE id_usuario = ? AND id_libro = ?', [userId, productId]);
            }
            res.status(200).send('Producto eliminado del carrito');
        } else {
            res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
};

exports.placeOrderFromCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await pool.query(
            'SELECT C.id_libro, L.precio, C.cantidad FROM Carrito C JOIN libros L ON C.id_libro = L.id WHERE C.id_usuario = ?',
            [userId]
        );

        let total = 0;
        cartItems.forEach(item => {
            total += item.precio * item.cantidad;
        });

        const result = await pool.query('INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)', [userId, total]);
        const orderId = result.insertId;

        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO DetallesPedidos (id_pedido, id_libro, cantidad, precio) VALUES (?, ?, ?, ?)',
                [orderId, item.id_libro, item.cantidad, item.precio]
            );
        }

        await pool.query('DELETE FROM Carrito WHERE id_usuario = ?', [userId]);

        res.status(201).send('Pedido realizado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al realizar el pedido');
    }
};
