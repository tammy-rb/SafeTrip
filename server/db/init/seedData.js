const connectDB = require('./connection');

const seedData = async () => {
  const connection = await connectDB();

  const teachers = [
    ['Miriam', 'Cohen', '302111111', 'A1'],
    ['Rivka', 'Levi', '302222222', 'A2'],
  ];

  const students = [
    ['Noa', 'BenDavid', '323000001', 'A1'],
    ['Yael', 'Mizrahi', '323000002', 'A1'],
    ['Tamar', 'Shalev', '323000003', 'A1'],
    ['Hadas', 'Avraham', '323000004', 'A1'],
    ['Shira', 'Peretz', '323000005', 'A1'],
    ['Ayelet', 'Biton', '323000006', 'A2'],
    ['Michal', 'Golan', '323000007', 'A2'],
    ['Adina', 'Dayan', '323000008', 'A2'],
    ['Efrat', 'Mor', '323000009', 'A2'],
    ['Liel', 'Haim', '323000010', 'A2'],
  ];

  try {
    await connection.query(
      'INSERT INTO Teachers (first_name, last_name, id_number, class_name) VALUES ?',
      [teachers],
    );

    await connection.query(
      'INSERT INTO Students (first_name, last_name, id_number, class_name) VALUES ?',
      [students],
    );
  } finally {
    await connection.end();
  }
};

module.exports = seedData;
