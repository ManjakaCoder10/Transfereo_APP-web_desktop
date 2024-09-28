const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const os = require('os');
const QRCode = require('qrcode'); // Import QRCode

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { transports: ['websocket'] });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

function clearUploadsFolder() {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier uploads:', err);
            return;
        }

        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), (err) => {
                if (err) {
                    console.error(`Erreur lors de la suppression du fichier ${file}:`, err);
                }
            });
        }
        console.log('Dossier uploads vidé.');
    });
}

clearUploadsFolder();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'Fichier uploadé avec succès', fileName: req.file.originalname });
    io.emit('file-uploaded', req.file.originalname);
});

app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(uploadDir, fileName);
    res.download(filePath);
});

app.get('/local-ip', (req, res) => {
    const localIp = getLocalIp();
    res.json({ localIp });
});

app.get('/generate-qr', async (req, res) => {
    const localIp = getLocalIp();
    const qrUrl = `http://${localIp}:3000`; 

    try {
        const qrCode = await QRCode.toDataURL(qrUrl);
        res.json({ qrCode });
    } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du QR code' });
    }
});

function getLocalIp() {
    const networkInterfaces = os.networkInterfaces();
    for (const iface in networkInterfaces) {
        for (const alias of networkInterfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; 
}

let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    
    console.log(`Un utilisateur est connecté. Nombre d'utilisateurs connectés : ${connectedUsers}`);
    
    if (connectedUsers >= 2) {
        io.emit('both-users-connected'); 
    }

    socket.on('disconnect', () => {
        connectedUsers--;
        console.log(`Un utilisateur a été déconnecté. Nombre d'utilisateurs connectés : ${connectedUsers}`);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
