const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
let aio = require('asterisk.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { format } = require('rut.js');
const path = require('path');

let ami = null;

const authMiddleware = require('./middlewares/auth');
const routeMiddleware = require('./middlewares/route');
const mongoConnect = require('./db');
const Contact = require('./models/Contact');
const User = require('./models/User');

const contactSchema = require('./schemas/contact');

// INIT
mongoConnect();
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: true,
  origins: ['http://localhost:3000'],
});

// MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(authMiddleware);

// Routes
app.get('/', (req, res) => {
  res.send({
    ping: 'pong',
  });
});

// Users
app.post('/api/users', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, ext } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      res.status(400);
      throw new Error('El Email ya esta en uso, por favor elige otro.');
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = new User({
      name: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
      ext,
      role: 'user',
    });

    const insertedUser = await newUser.save();

    if (!insertedUser) {
      res.status(400);
      throw new Error('Ha ocurrido un error.');
    }

    res.status(201).json(insertedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado.');
    }
    res.status(200);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      res.status(404);
      throw new Error(`Usuario no encontrado.`);
    }

    res.status(200);
    res.json({ id: user.id });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/users/break', async (req, res, next) => {
  try {
    const { id } = req.user;
    const { pauseType, activateBreak } = req.body;

    if (activateBreak) {
      // pause OFF
      let userToUpdate = await User.findById(id);

      userToUpdate.pauses.slice(-1)[0].end = Date.now();

      await userToUpdate.save();
    } else {
      // pause ON
      await User.findByIdAndUpdate(
        id,
        { $push: { pauses: { pauseType } } },
        { new: true },
      );
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Auth
app.get('/api/auth', (req, res, next) => {
  try {
    if (!req.get('authorization')) {
      res.status(401);
      throw new Error('Credenciales invalidas.');
    }
    res.status(200);
    res.json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error(
        'Nombre de usuario y/o Contraseña incorrectos, intenta nuevamente.',
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error(
        'Nombre de usuario y/o Contraseña incorrectos, intenta nuevamente.',
      );
    }

    let addedSesionId = '';
    const addedSesion = await User.findByIdAndUpdate(
      user.id,
      { $push: { register: {} } },
      { new: true },
    );

    addedSesionId = addedSesion.register.slice(-1)[0]._id;

    const payload = {
      id: user.id,
      email: user.email,
      ext: user.ext,
      name: user.name,
      role: user.role,
      sessionId: addedSesionId,
    };

    jwt.sign(
      payload,
      'JWT_SECRET',
      {
        expiresIn: '1d',
      },
      (error, token) => {
        if (error) {
          res.status(400);

          throw new Error(
            'Nombre de usuario y/o Contraseña incorrectos, intenta nuevamente.',
          );
        } else {
          res.status(200).json({ token });
        }
      },
    );
  } catch (error) {
    next(error);
  }
});

app.post('/api/logout', async (req, res, next) => {
  try {
    const { id, sessionId } = req.user;

    let userToUpdate = await User.findById(id);

    userToUpdate.register.map((reg) => {
      if (reg._id.toString() === sessionId) {
        reg.logout = Date.now();
        return reg;
      }
      return reg;
    });

    await userToUpdate.save();

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Contacts
app.put('/api/contacts', async (req, res, next) => {
  try {
    const { phone, firstName, lastName, rut } = req.body;

    const validation = contactSchema.validate({
      phone,
      firstName,
      lastName,
      rut,
    });

    if (validation.error) {
      res.status(400);
      //console.log(validation.error.details);
      throw new Error(validation.error);
    }

    const updated = await Contact.findOneAndUpdate(
      { phone },
      {
        name: {
          firstName,
          lastName,
        },
        rut: format(rut),
      },
      {
        new: true,
      },
    );
    res.send(updated);
  } catch (error) {
    next(error);
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.use(routeMiddleware.notFound);
app.use(routeMiddleware.errorHandler);

// ASTERISK IO
ami = aio.ami(
  '192.168.10.249', // Asterisk PBX machine
  5038, // the default port number setup
  'admin', // manager username
  '4dm1ntmk', // manager password
);

ami.on('error', (err) => {
  //throw err;
  console.log('ami error', err);
});

ami.on('ready', function () {
  console.log('connected to ami');
  //ami.action(
  //'ExtensionState',
  //{
  //Exten: '6600',
  //},
  //(data) => {
  //console.log('Ext State', data);
  //}
  //);
});

let count  = 0;
ami.on('eventAny', (data) => {
  //Emitir cualquier evento hacia el cliente
  if (data.Event !== 'VarSet' && data.Even !== 'Newexten'){
    console.log(data);
  }
});

//ami.on('eventDeviceStateChange', (data) => {
//console.log(data);
//io.to(data.Device).emit('DeviceStateChange', data.State);
//});

ami.on('eventExtensionStatus', (data) => {
  console.log('ext status', data);
  io.to(`SIP/${data.Exten}`).emit('ExtStateChange', data.StatusText);
});

ami.on('AgentLogin', (data) => {
  console.log('login', data);
});

// Dial Begin listener
// se ejecuta el momento previo a llamar a los anexos
ami.on('eventDialBegin', async (data) => {
  //console.log(data);
  const callIDNum = data.CallerIDNum;
  const contact = await Contact.findOne({ phone: callIDNum });
  const room = `SIP/${data.DialString}`;

  if (!contact) {
    try {
      const newContact = new Contact({
        phone: callIDNum,
      });

      const addedContact = await newContact.save();
      io.to(room).emit('DialBegin', addedContact);
    } catch (error) {
      console.log('algun error');
    }
  } else {
    io.to(room).emit('DialBegin', contact);
  }
});

// Bridge Enter listener
// se ejecuta al momento que un anexo conesta
ami.on('eventBridgeEnter', async (data) => {
  const callIDNum = data.CallerIDNum;
  const contact = await Contact.findOne({ phone: callIDNum });
  const room = `SIP/${data.ConnectedLineNum}`;

  console.log(data);
  io.to(room).emit('BridgeEnter', contact);
});

// Hangup listener
// se ejecuta al colgar
ami.on('eventHangup', (data) => {
  console.log('hangup', data);
  if (data.Context === 'from-internal') {
    const room = `SIP/${data.CallerIDNum}`;
    console.log('room', room);
    io.to(room).emit('Hangup');
  }
});

// SOCKET IO
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join', (room) => {
    console.log('joining room', room);
    socket.join(room);
  });

  socket.on('leave', (room) => {
    console.log('leaving room', room);
    socket.leave(room);
  });

  socket.on('checkExtState', (ext) => {
    console.log('Check Ext State');
    ami.action(
      'ExtensionState',
      {
        Exten: ext,
      },
      (data) => {
        console.log('Ext State', data);
        io.to(`SIP/${data.Exten}`).emit('checkedExtState', data.StatusText);
      },
    );
  });

  socket.on('activarPausa', () => {
    console.log('ok pausa');
  });

  socket.on('desactivarPausa', () => { });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.i);
  });
});

server.listen(3001, () => {
  console.log('server running on port 3001');
});
