const express = require('express');
const os = require('os');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server);
// const expressWs = require('express-ws')(app);

const MongoOplog = require('mongo-oplog');

// local db
// const usersOplog = MongoOplog('mongodb://127.0.0.1:27017/local', {ns:'rpi_greenhouse.users'});
// const greenhousesOplog = MongoOplog('mongodb://127.0.0.1:27017/local', {ns:'rpi_greenhouse.greenhouses'});

// hosted db
const oplog = MongoOplog('mongodb://om3ga:bahek233@rpi-greenhouse-shard-00-00-znor7.mongodb.net:27017,rpi-greenhouse-shard-00-01-znor7.mongodb.net:27017,rpi-greenhouse-shard-00-02-znor7.mongodb.net:27017/local?ssl=true&replicaSet=rpi-greenhouse-shard-0&authSource=admin&retryWrites=true');





const ObjectId = require('mongodb').ObjectID;
// const passwordHash = require('password-hash'); //deprecated
// password hasing variables
const bcrypt = require('bcrypt');
const saltRounds = 10;
// ---
app.set('superSecret', 'megasecretpasswordthatwillnerverbeshowntoenaonaidontknowhwamiamdoninghdbas'); // secret variable

app.use(express.static('dist'));




app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// url to localhost db
// const dbRoute = 'mongodb://localhost:27017/rpi_greenhouse';

// url to hosted db
const dbRoute = 'mongodb+srv://om3ga:bahek233@rpi-greenhouse-znor7.mongodb.net/test?retryWrites=true';

// connect to the db and strt express server
let db;
MongoClient.connect(dbRoute, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) throw err;
  db = client.db('rpi_greenhouse');
  // start the server only if the database is available
  server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
});

// API ROUTES --------------------------

let apiRoutes = express.Router();

// // get all the users
// apiRoutes.get('/users', (req, res) => {
//   // res.send('Welcome to the best api');
//   db.collection('users').find().toArray((err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
//
// });


const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (typeof header !== 'undefined') {
    // might not be needed
    // will prob get rid of it
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    // inexistent authorisation header / token
    res.status(403).send({message:'No token provided'});
  }
};


// get all the users
apiRoutes.get('/userinfo', checkToken, (req, res) => {
  // verify if the token is valid
  jwt.verify(req.token, app.get('superSecret'), (err, userData) => {
    // get the user by ID
    db.collection('users').findOne({_id:new ObjectId(userData.id)}, (err, user) => {
      if(err) throw err;
      // send all the data to the database;
      delete user.password;
      res.send(user);
    });
  });

});

// authenticate user
apiRoutes.post('/authenticate', (req, res) => {
  // validate email and password first


  db.collection('users').findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;
    // console.log(user);
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. Email not found.'
      });
    } else {

      // let's decrypt the password
      bcrypt.compare(req.body.password, user.password, (err, passResult) => {
        if (!passResult) {
          // wrong pass
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // if user is found and password is right
          // create a token that will contain the userID
          const token = jwt.sign({id: user._id}, app.get('superSecret'), {
            expiresIn: 1440 // expires in 24 hours
          });
          // delete the user password -will get deleted/commented soon after debug
          delete user.password;
          // send the token containing the user ID
          res.send(token);
        }
      });
    }
  });
});

apiRoutes.post('/register', (req, res) => {
  // need to add validation for whait is send from the UI/users


  db.collection('users').findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;
    if (!user) {
      // no user uses this email so we can register the user
      // let's hash the password
      // might have to write this in async in the future

      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        // save the user in the database using the data from the submited form
        const id = new ObjectId();
        db.collection('users').insertOne({
          _id: id,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          admin: false,
          greenhouses: [],
          address:'',
          number:'',
          createdOn: new Date()
        });

        // create a token for the user
        const token = jwt.sign({id: id}, app.get('superSecret'), {expiresIn: 1440});

        console.log(`User ${req.body.email} has been registered into the database! Watch out!`);
        // send the token to the user
        res.send(token);
      });
    } else {
      // send an error to the client that the user already exists
      res.json({
        success: false,
        message: 'This email is already in use'
      });
    }
  });
});

apiRoutes.put('/updateuser', checkToken, (req,res)=>{
  // maybe some validation there before even verifying the token
  if(!req.hasOwnProperty('body')) {
    res.send({success: false, message:'No values arrieved in the API!'});
  } else {
    jwt.verify(req.token, app.get('superSecret'), (err, userData)=>{

      if(req.body.hasOwnProperty('password') && req.body.hasOwnProperty('oldPassword')) {

        db.collection('users').findOne({_id: ObjectId(userData.id)}, (err, user)=>{
          if(err) throw err;

          bcrypt.compare(req.body.oldPassword, user.password, (err, passResult) => {

            if (!passResult) {
              res.send({success: false, message:'Old password don\'t match'});
            } else {
              bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
                if (err) throw err;
                db.collection('users').updateOne({_id:ObjectId(userData.id)}, {$set: {password:hash}});
                res.send({success:true});
              });
            }
          });
        });
      } else if (!req.body.hasOwnProperty('admin')) {
        console.log(req.body);
        db.collection('users').updateOne({_id: ObjectId(userData.id)},{$set: req.body});
        res.send({success:true});
      } else{
        res.send({success:false, message: 'Bad request!'});
      }
    });
  }
});

apiRoutes.put('/assigngreenhouse', checkToken, (req, res) => {
  // let the user register a greenhouse to its name
  // note: the user can not insert a greenhouse to the database
  // console.log(req.token);
  jwt.verify(req.token, app.get('superSecret'), (err, userData) => {
    if (err) throw err;
    // find the database by name

    db.collection('greenhouses').findOne({
      name: req.body.greenhousename
    }, (err, greenhouse) => {
      if (err) throw err;

      if (!greenhouse) {
        res.send({
          success: false,
          message: `There is no greenhouse called ${req.body.greenhousename}`
        });
      } else {
        db.collection('users').updateOne({
          _id: new ObjectId(userData.id)
        }, {
          $addToSet: {
            greenhouses: greenhouse._id
          }
        });
        res.send({success: true});
      }
    });
  });
});

apiRoutes.delete('/unassigngreenhouse/:id', checkToken, (req, res) => {
  // let the user register a greenhouse to its name
  // note: the user can not insert a greenhouse to the database
  // console.log(req.token);
  jwt.verify(req.token, app.get('superSecret'), (err, userData) => {
    if (err) throw err;
    // find the database by name

    db.collection('greenhouses').findOne({
      _id: new ObjectId(req.params.id)
    }, (err, greenhouse) => {
      if (err) throw err;
      // greenhouse exists
      // now unasign it from the user
      db.collection('users').updateOne({
        _id: new ObjectId(userData.id)
      }, {
        $pull: {
          greenhouses: greenhouse._id
        }
      });
      res.send({success: true});
    });
  });
});


apiRoutes.get('/getgreenhouses', checkToken, (req, res) => {
  // verify token
  jwt.verify(req.token, app.get('superSecret'), (err, userData) => {
    if (err) throw err;
    db.collection('users').findOne({
      _id: new ObjectId(userData.id)
    }, (err, user) => {

      db.collection('greenhouses').find({
        _id: {
          $in: user.greenhouses
        }
      }).toArray((err, greenhouses) => {
        if (err) throw err;
        // console.log(greenhouses);
        res.json(greenhouses);
      });
    });
  });
});

// update user based on info supplied in request body
apiRoutes.put('/greenhousecontrols', checkToken , (req, res) => {
  const greenhouseName = req.body.name;
  console.log(req.body);
  delete req.body.name;
  jwt.verify(req.token, app.get('superSecret'), (err,userData) => {
    if(err) throw err;

    db.collection('greenhouses').updateOne({name:greenhouseName}, { $set: {controls: req.body}}, (err, result) => {
      if(err) throw err;
      return res.send({success: true});
    });
  });
});

app.use('/api', apiRoutes);

tail();

io.on('connection', client => {
  // simple connection test
  console.log(io.engine.clientsCount);
  // tailing changes in the users db
  // tailUsers();
  // usersOplog.on('update',doc=>{
  //   client.emit('dbupdate', doc.o);
  // });

  // tail changes in the greenhouses db
  // BUG: ! THIS EVENT FIRES MULTIPLE TIME IF THE USER REFRESHES THE PAGE!
  oplog.on('update', doc => {
    if(doc.ns === 'rpi_greenhouse.greenhouses') {
      // get the greenhouse that was edited
      db.collection('greenhouses').findOne({_id: new ObjectId(doc.o2._id)}, (err, greenhouse) =>{
        if(err) throw err;
        client.emit('greenhouse_updated', greenhouse);
      });
    } else if(doc.ns === 'rpi_greenhouse.users') {
      // user got updated do something
    }
  });

  client.on('end', function() {
    client.disconnect(0);
  });

});
io.on('disconnect', client => {
  stopTailing();
});









async function tail() {
  try {
    await oplog.tail();
  } catch (err) {
    console.log(err);
  }
}

async function tailUsers() {
  try {
    await usersOplog.tail();
    console.log('tailing started on users db');
  } catch (err) {
    console.log(err);
  }
}

async function tailGreenhouses() {
  try {
    await greenhousesOplog.tail();
    console.log('tailing started on greenhouses db');
  } catch (err) {
    console.log(err);
  }
}

// fires in case there is a create in the db
async function emitCreate() {
  try {
    await oplog.on('insert', doc=> {
      return doc;
    });
  } catch(err) {
    console.log(err);
  }
}

// fires in case there is an update in the db
async function emitUpdate() {
  try {
    await oplog.on('update', doc=> {
      return doc;
    });
  } catch(err) {
    console.log(err);
  }
}

// fires in case there is a delete in the db
async function emitDelete() {
  try {
    await oplog.on('delete', doc=> {
      return doc;
    });
  } catch(err) {
    console.log(err);
  }
}

// stops the tailing proccess
async function stopTailing() {
  try {
    await oplog.stop(() => {
      console.log('OPLOG stopped');
    });
  } catch(err) {
    console.log(err);
  }
}
