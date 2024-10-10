const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

// Initialize Express
const app = express();
app.use(express.json());

app.post('/update-readme', async (req, res) => {
  const newLine = req.body.newLine || '# Default line added to README';

  try {
    // Append new content to README.md
    fs.appendFileSync('README.md', `\n${newLine}`);

    // Run git commands using exec
    exec('git add README.md', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running git add: ${stderr}`);
        return res.status(500).send(`Error running git add: ${stderr}`);
      }

      exec('git commit -m "Auto-update: Added new line to README.md"', (err, stdout, stderr) => {
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
          res.send('README.md updated and pushed to GitHub!');
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating README.md: ' + error);
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
