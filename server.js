const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server running on port: 8000');
})

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });

const io =socket(server);

io.on('connection', (socket) => {
    console.log(socket.id)
    io.to(socket.id).emit('updateData', tasks); 
    console.log('tasks', tasks)

  
    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
        console.log('addTask')
        console.log('actual tasks', tasks)

    });

    socket.on('removeTask', (taskId) => {
        tasks.splice((tasks.indexOf(tasks.find(task => taskId == task.id))), 1)
        socket.broadcast.emit('removeTask', taskId);
        console.log('removeTask')
        console.log('actual tasks', tasks)

    });

    socket.on('editTask', payload => {
        console.log('payload: ', payload)
        const task = tasks.find(task => (task.id === payload.id))
        if (task) {task.name = payload.name}

        socket.broadcast.emit('editTask', payload)
       // console.log('editTask')
        console.log('tasks after edit', tasks)
    })
  });

