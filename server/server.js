import { Server } from 'socket.io'
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/document-controller.js';

const PORT = 8080

const URL = process.env.MONGODB_URI || `mongodb+srv://aashishdcricketer:wlIET8KW4e5fNRZR@cluster0.ep0dnvb.mongodb.net/?retryWrites=true&w=majority`
Connection(URL);

const io = new Server(PORT, {
   cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
   }
})

io.on('connection', socket => {
   socket.on('get-document', async documentId => {
      const document = await getDocument(documentId)
      socket.join(documentId)
      socket.emit('load-document', document.data)

      socket.on('send-changes', delta => {
         socket.to(documentId).emit('receive-changes', delta)
      })

      socket.on('save-document', async data => {
         await updateDocument(documentId, data)
      })
   })


   
})

// io.listen(8080)