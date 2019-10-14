const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  let user = req.body;

  // validate the user


  //hash the password
  const hash = bcrypt.hashSync(user.password, 8);

  //we override the password with the hash 
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;




  Users.findBy({ username })
    .first()
    .then(user => {
     
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// implement the protected middleware that will check for username and password/
// in the headers and if valid provide access to the enpoint
function protected(){
// was finishing and fixing previous examples

}


server.get('/hash', (req, res)=>{
// need a walk through for it 
const password = req.headers.authorization;

const hash = bcrypt.hashSync(password, 14); //the 8 is the number of rounds 2 to the 8th

res.status(200).json({ hash });
})


const port = process.env.PORT || 5002;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
