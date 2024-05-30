const pool = require('../database');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await pool.query('SELECT * FROM usuarios WHERE rol = "cliente"');
    res.json(clients);
  } catch (error) {
    res.status(500).send('Error fetching clients');
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await pool.query('SELECT * FROM libros');
    res.json(books);
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, descripcion, precio, stock } = req.body;
  try {
    await pool.query('UPDATE libros SET titulo = ?, autor = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?', [titulo, autor, descripcion, precio, stock, id]);
    res.send('Book updated');
  } catch (error) {
    res.status(500).send('Error updating book');
  }
};

exports.addBook = async (req, res) => {
  const { titulo, autor, descripcion, precio, stock } = req.body;
  try {
    await pool.query('INSERT INTO libros (titulo, autor, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?)', [titulo, autor, descripcion, precio, stock]);
    res.status(201).send('Book added');
  } catch (error) {
    res.status(500).send('Error adding book');
  }
};
