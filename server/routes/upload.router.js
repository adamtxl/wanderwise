const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Use a transaction to ensure all inserts succeed or fail together
      pool.connect()
        .then(client => {
          return client.query('BEGIN')
            .then(() => {
              const insertPromises = results.map(row => {
                const { name, description, latitude, longitude } = row;
                return client.query(
                  'INSERT INTO testtable (name, description, latitude, longitude) VALUES ($1, $2, $3, $4)',
                  [name, description, latitude, longitude]
                );
              });
              return Promise.all(insertPromises);
            })
            .then(() => client.query('COMMIT'))
            .catch(err => {
              console.error('Error during the transaction, rolling back.', err);
              return client.query('ROLLBACK');
            })
            .finally(() => {
              client.release();
              // Delete the file after processing
              fs.unlinkSync(filePath);
              res.send('File uploaded and data inserted successfully');
            });
        })
        .catch(err => {
          console.error('Error acquiring client', err);
          res.status(500).send('Error inserting data');
        });
    });
});

module.exports = router;