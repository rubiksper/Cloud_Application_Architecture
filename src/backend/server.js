const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Module pour la manipulation des fichiers
const gemData = require('../data/gem.json');
const MySQLEvents = require('@rodrigogs/mysql-events');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'praha-gem'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Ajouter les nouvelles données de la base de données au fichier JSON au démarrage du serveur
    addNewDataToJSON();
});
function addNewDataToJSON() {
  const query = 'SELECT * FROM gem';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Erreur lors de la récupération des données de la base de données :', error);
      } else {
          // Supprimer les données obsolètes du fichier JSON
          gemData.features = gemData.features.filter(feature => {
              return results.some(row => 
                  feature.properties.name.toLowerCase() === row.Nom.toLowerCase() &&
                  feature.geometry.coordinates[0] === row.longitude &&
                  feature.geometry.coordinates[1] === row.latitude
              );
          });

          // Ajouter les nouvelles données dans le format requis
          results.forEach(row => {
              const existingFeature = gemData.features.find(feature => 
                  feature.properties.name.toLowerCase() === row.Nom.toLowerCase() &&
                  feature.geometry.coordinates[0] === row.longitude &&
                  feature.geometry.coordinates[1] === row.latitude
              );

              if (!existingFeature) {
                  const newFeature = {
                      type: 'Feature',
                      properties: {
                          name: row.Nom,
                          address: row.Adresse,
                          description: row.Description
                      },
                      geometry: {
                          type: 'Point',
                          coordinates: [row.longitude, row.latitude]
                      }
                  };

                  // Add contributor credit if available
                  if (row.contributeur) {
                      newFeature.properties.description += `\n\n\n\nCredit: ${row.contributeur}`;
                  }

                  gemData.features.push(newFeature);
              }
          });

          // Écrire les données mises à jour dans le fichier JSON
          fs.writeFile('../data/gem.json', JSON.stringify(gemData, null, 2), err => {
              if (err) {
                  console.error('Erreur lors de l\'écriture dans le fichier JSON :', err);
              } else {
                  console.log('Données mises à jour dans gem.json avec succès');
              }
          });
      }
  });
}


// Création d'une instance MySQLEvents
const instance = new MySQLEvents({
  host: 'localhost',
  user: 'root',
  password: '',
}, {
  startAtEnd: true,
});

// Ajout d'un écouteur d'événements pour la table gem
instance.addTrigger({
  name: 'monitor_gem_table',
  expression: 'praha-gem.gem',
  statement: MySQLEvents.STATEMENTS.ALL,
  onEvent: (event) => {
    if (event.type === 'insert' || event.type === 'update' || event.type === 'delete') {
      console.log('Changes detected in gem table. Restarting server...');
      // Code pour relancer le serveur ici
      // Vous pouvez soit exécuter une fonction pour arrêter et redémarrer le serveur, 
      // soit utiliser un module comme 'child_process' pour exécuter une nouvelle instance de votre serveur.
    }
  },
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  connection.query('SELECT * FROM users WHERE email = ?', [email], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking email:', selectErr);
      return res.status(500).json({ error: 'An error occurred during signup' });
    }

    if (selectResults.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = { name, email, password };
    connection.query('INSERT INTO users SET ?', user, (insertErr) => {
      if (insertErr) {
        console.error('Error during signup:', insertErr);
        return res.status(500).json({ error: 'An error occurred during signup' });
      }
      console.log('User signed up successfully');
      return res.json({ message: 'User signed up successfully' });
    });
  });
});





// Endpoint pour rejeter une proposition de localisation spécifique
app.delete('/location-proposals/:id', (req, res) => {
  const proposalId = req.params.id;
  // Supprimer la proposition de localisation de la table location_proposals
  const deleteQuery = 'DELETE FROM location_proposal WHERE id = ?';
  connection.query(deleteQuery, [proposalId], (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting location proposal:', deleteError);
      return res.status(500).json({ error: 'An error occurred while deleting location proposal' });
    }
    res.json({ message: 'Location proposal rejected and deleted successfully' });
  });
});



app.post('/login', (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
    if (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'An error occurred during login' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = results[0];
    // Redirection en fonction du rôle de l'utilisateur
    let redirectUrl = '';
    if (user.role === 'admin') {
      redirectUrl = '/AdminHouse';
    } else if (user.role === 'user') {
      redirectUrl = '/home';
    } else {
      redirectUrl = '/guest';
    }
    res.json({ message: 'User logged in successfully', user: { id: user.id, name: user.name, role: user.role }, redirectUrl });
  });
});



app.post('/loginAsGuest', (req, res) => {
  // Logic for guest login
  // Here, you can simply respond with status 200 OK to indicate to the frontend to redirect to the home page
  res.status(200).send('Logged in as guest successfully');
});




  
  // Endpoint pour ajouter une localisation
  app.post('/locations', (req, res) => {
    const { name, address, description, latitude, longitude } = req.body;

    // Vérifier si tous les champs nécessaires sont présents
    if (!name || !address || !description || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Vérifier si les coordonnées sont des nombres valides
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const query = 'INSERT INTO gem (Nom, Adresse, Description, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, address, description, latitude, longitude], (error, results) => {
        if (error) {
            console.error('Error adding location:', error);
            res.status(500).json({ error: 'An error occurred while adding location' });
        } else {
            // Mettre à jour le fichier gem.json avec les nouvelles données
            updateGemJsonFile();
            res.json({ message: 'Location added successfully' });
        }
    });
});

// Fonction pour mettre à jour le fichier gem.json avec les nouvelles données de la base de données
function updateGemJsonFile() {
  const query = 'SELECT * FROM gem ORDER BY id DESC LIMIT 1'; // Sélectionne la dernière entrée ajoutée à la base de données
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Erreur lors de la récupération des données de la base de données :', error);
      } else {
          if (results.length > 0) {
              const newLocation = results[0];
              const newFeature = {
                  type: 'Feature',
                  properties: {
                      name: newLocation.Nom,
                      address: newLocation.Adresse,
                      description: newLocation.Description
                  },
                  geometry: {
                      type: 'Point',
                      coordinates: [newLocation.longitude, newLocation.latitude]
                  }
              };
              
              // Ajouter la nouvelle fonctionnalité à la liste existante
              gemData.features.push(newFeature);
              
              // Écrire les données mises à jour dans le fichier JSON
              fs.writeFile('../data/gem.json', JSON.stringify(gemData, null, 2), err => {
                  if (err) {
                      console.error('Erreur lors de l\'écriture dans le fichier JSON :', err);
                  } else {
                      console.log('gem.json updated successfully');
                  }
              });
          } else {
              console.log('Aucune nouvelle localisation à ajouter à gem.json');
          }
      }
  });
}


  
// Endpoint pour supprimer une localisation
app.delete('/locations/:name', (req, res) => {
  const locationName = req.params.name;

  // Vérifier si le nom de la localisation est fourni
  if (!locationName) {
      return res.status(400).json({ error: 'Location name is required' });
  }

  const query = 'DELETE FROM gem WHERE Nom = ?';
  connection.query(query, [locationName], (error, results) => {
      if (error) {
          console.error('Error deleting location:', error);
          res.status(500).json({ error: 'An error occurred while deleting location' });
      } else {
          // Vérifier si une localisation a été supprimée
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'Location not found' });
          }
          // Mettre à jour le fichier gem.json après la suppression
          updateGemJsonFileAfterDeletion(locationName);
          res.json({ message: 'Location deleted successfully' });
      }
  });
});





// Fonction pour mettre à jour le fichier gem.json après la suppression
function updateGemJsonFileAfterDeletion(locationName) {
  // Supprimer la localisation correspondante de gemData.features
  gemData.features = gemData.features.filter(feature => feature.properties.name !== locationName);
  
  // Écrire les données mises à jour dans le fichier JSON
  fs.writeFile('../data/gem.json', JSON.stringify(gemData, null, 2), err => {
      if (err) {
          console.error('Erreur lors de l\'écriture dans le fichier JSON :', err);
      } else {
          console.log('gem.json updated successfully after deletion');
      }
  });
}

app.post('/location-proposals', (req, res) => {
  const { name, address, description, latitude, longitude, username } = req.body;

  // Vérifier si tous les champs nécessaires sont présents
  if (!name || !address || !description || !latitude || !longitude || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Vérifier si les coordonnées sont des nombres valides
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  // Insérer la proposition de localisation dans la base de données
  const query = 'INSERT INTO location_proposal (Nom, Adresse, Description, latitude, longitude, user_name) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, address, description, latitude, longitude, username], (error, results) => {
    if (error) {
      console.error('Error adding location proposition:', error);
      return res.status(500).json({ error: 'An error occurred while adding location proposition' });
    }
    
    res.json({ message: 'Location proposal submitted successfully' });
  });
});


// Endpoint pour récupérer toutes les propositions de localisation
app.get('/location-proposals', (req, res) => {
  const query = 'SELECT * FROM location_proposal';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching location proposals:', error);
      return res.status(500).json({ error: 'An error occurred while fetching location proposals' });
    }
    res.json(results);
  });
});

// Endpoint pour approuver une proposition de localisation spécifique
app.post('/location-proposals/:id/approve', (req, res) => {
  const proposalId = req.params.id;
  // Récupérer les détails de la proposition à partir de la table location_proposals
  const selectQuery = 'SELECT * FROM location_proposal WHERE id = ?';
  connection.query(selectQuery, [proposalId], (selectError, selectResults) => {
    if (selectError) {
      console.error('Error fetching location proposal details:', selectError);
      return res.status(500).json({ error: 'An error occurred while fetching location proposal details' });
    }

    if (selectResults.length === 0) {
      return res.status(404).json({ error: 'Location proposal not found' });
    }

    const proposal = selectResults[0];
    // Insérer la proposition de localisation approuvée dans la table gem
    const insertQuery = 'INSERT INTO gem (Nom, Adresse, Description, latitude, longitude, contributeur) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [proposal.Nom, proposal.Adresse, proposal.Description, proposal.latitude, proposal.longitude, proposal.user_name], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error adding location to gem table:', insertError);
        return res.status(500).json({ error: 'An error occurred while adding location to gem table' });
      }
      // Supprimer la proposition de localisation de la table location_proposals
      const deleteQuery = 'DELETE FROM location_proposal WHERE id = ?';
      connection.query(deleteQuery, [proposalId], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error deleting location proposal:', deleteError);
          return res.status(500).json({ error: 'An error occurred while deleting location proposal' });
        }
        addNewDataToJSON();
        res.json({ message: 'Location proposal approved and added to gem table successfully' });
      });
    });
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

