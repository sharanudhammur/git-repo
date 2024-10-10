const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

// Initialize Express
const app = express();
app.use(express.json());

app.post('/update-code', async (req, res) => {
  const newLine = '// Default new line';

  console.log("test");
  
  try {
    // Append new line to index.js
    fs.appendFileSync('index.js', `\n${newLine}`);

    // Run git commands using exec
    exec('git add .', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running git add: ${stderr}`);
        return res.status(500).send(`Error running git add: ${stderr}`);
      }

      exec('git commit -m "Auto-update: Added new line to index.js"', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error running git commit: ${stderr}`);
          return res.status(500).send(`Error running git commit: ${stderr}`);
        }

        exec('git push origin main', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error running git push: ${stderr}`);
            return res.status(500).send(`Error running git push: ${stderr}`);
          }

          // If everything is successful
          res.send('Code updated and pushed to GitHub!');
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating code: ' + error);
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Default new line