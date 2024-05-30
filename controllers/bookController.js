const pool = require('../database');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await pool.query('SELECT * FROM libros');
        const bookData = books.map(book => ({
            id: book.id,
            titulo: book.titulo,
            autor: book.autor,
            descripcion: book.descripcion,
            precio: book.precio,
            stock: book.stock
        }));
        res.json(bookData); 
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    }
};


  
  exports.searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
      const products = await pool.query('SELECT * FROM libros WHERE nombre LIKE ?', [`%${query}%`]);
      res.json(products); 
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).send('Error searching products');
    }
  };
