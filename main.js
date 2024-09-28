const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'transfert-de-donnees(1).png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.setMenu(null);

    
    mainWindow.loadURL('data:text/html,' + encodeURIComponent(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transfereo App</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Roboto', sans-serif;
                    background: rgba(44, 62, 80, 0.5);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .container {
                    background: rgba(255, 255, 255, 0.9);
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    animation: fadeIn 1s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                    color: #333;
                }

                p {
                    font-size: 1rem;
                    margin-bottom: 30px;
                    color: #555;
                }

                input[type="password"] {
                    width: 100%;
                    padding: 15px;
                    font-size: 1rem;
                    border: 2px solid #ccc;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }

                input[type="password"]:focus {
                    border-color: #4e54c8;
                    outline: none;
                }

                button {
                    width: 100%;
                    padding: 15px;
                    font-size: 1.2rem;
                    color: white;
                    background-color: #4e54c8;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background-color: #3b3fc1;
                }

                @media (max-width: 768px) {
                    h1 {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    h1 {
                        font-size: 1.7rem;
                    }

                    button {
                        font-size: 1rem;
                        padding: 12px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Accès sécurisé</h1>
                <p>Veuillez entrer le mot de passe root pour accéder à l'application Transfereo.</p>
                <input type="password" id="passwordInput" placeholder="Entrez votre mot de passe">
                <button id="submitBtn">Soumettre</button>

                <script>
                    const { ipcRenderer } = require('electron');
                    document.getElementById('submitBtn').addEventListener('click', () => {
                        const password = document.getElementById('passwordInput').value;
                        ipcRenderer.send('password-submitted', password);
                    });
                </script>
            </div>
        </body>
        </html>
    `));

    ipcMain.on('password-submitted', (event, password) => {
        console.log('Mot de passe entré:', password);


        checkPassword(password);
    });
}


function checkPassword(password) {
    const command = `echo ${password} | sudo -k -S true`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Mot de passe incorrect: ${stderr}`);
            mainWindow.webContents.send('error', 'Mot de passe incorrect : ' + stderr);
        } else {
            console.log('Mot de passe correct, ouverture des ports.');
            openPorts(password);
        }
    });
}


function openPorts(password) {
    const command = `
        echo ${password} | sudo -S iptables -A INPUT -p tcp --dport 3000 -j ACCEPT &&
        echo ${password} | sudo -S iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
    `;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'ouverture des ports: ${stderr}`);
            mainWindow.webContents.send('error', 'Erreur lors de l\'ouverture des ports : ' + stderr);
        } else {
            console.log(`Sortie de la commande: ${stdout}`);
            mainWindow.webContents.send('success', 'Les ports 3000 et 5000 ont été ouverts avec succès.');

         
            mainWindow.loadURL('http://localhost:3000');
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


/*const path = require('path'); 

let mainWindow;

 <TypeAnimation
  sequence={[
    'Transfereo',
    500,
    'Transfereo App', //  Continuing previous Text
    500,
    'Transfereo App desktop',
    500,
    'Transfereo App',
    500,
    'Transfereo',
    500,
    '',
    500,
  ]}
  
  repeat={Infinity}
/> */

/*    <div className="text-center mb-4">
                                {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />}
                            </div>*/

                            /*  const [qrCode, setQrCode] = useState('');*/

                            /*    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/generate-qr`);
                setQrCode(response.data.qrCode);
            } catch (error) {
                console.error('Erreur lors de la récupération du QR code:', error);
            }
        };

        fetchQRCode();
    }, [localIp]);*/