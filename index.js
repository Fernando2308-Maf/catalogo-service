const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// ─── Base de datos simulada en memoria ───────────────────────────────────────
const libros = [
  { id: 1, titulo: 'Cien años de soledad',      autor: 'Gabriel García Márquez',    precio: 15.99, stock: 10 },
  { id: 2, titulo: 'El principito',              autor: 'Antoine de Saint-Exupéry',  precio:  9.99, stock:  5 },
  { id: 3, titulo: '1984',                       autor: 'George Orwell',              precio: 12.99, stock:  8 },
  { id: 4, titulo: 'Don Quijote de la Mancha',   autor: 'Miguel de Cervantes',        precio: 18.99, stock:  3 },
  { id: 5, titulo: 'El señor de los anillos',    autor: 'J.R.R. Tolkien',             precio: 24.99, stock:  0 },
];

let siguienteId = 6;

// ─── GET /api/libros/:id ──────────────────────────────────────────────────────
app.get('/api/libros/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const libro = libros.find((l) => l.id === id);

  if (!libro) {
    return res.status(404).json({
      error: `Libro con id ${id} no encontrado en el catálogo.`,
    });
  }

  return res.status(200).json(libro);
});

// ─── POST /api/libros — Insertar un nuevo libro ───────────────────────────────
app.post('/api/libros', (req, res) => {
  const { titulo, autor, precio, stock } = req.body;

  if (!titulo || !autor || precio === undefined) {
    return res.status(400).json({
      error: 'Faltan datos. Se requieren: titulo, autor y precio.',
    });
  }

  const nuevoLibro = {
    id: siguienteId++,
    titulo,
    autor,
    precio: parseFloat(precio),
    stock: stock !== undefined ? parseInt(stock, 10) : 0,
  };

  libros.push(nuevoLibro);

  return res.status(201).json({
    mensaje: '✅ Libro agregado exitosamente.',
    libro: nuevoLibro,
  });
});

// ─── DELETE /api/libros/:id — Eliminar un libro ───────────────────────────────
app.delete('/api/libros/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = libros.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Libro con id ${id} no encontrado. No se pudo eliminar.`,
    });
  }

  const eliminado = libros.splice(index, 1)[0];

  return res.status(200).json({
    mensaje: '🗑️ Libro eliminado exitosamente.',
    libro: eliminado,
  });
});

// ─── Inicio del servidor ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📚 Servicio de Catálogo corriendo en http://localhost:${PORT}`);
});

module.exports = app; // necesario para Vercel (serverless)
