import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import imageHOME from './IMAGE/Home.png';
import iconHOME from './IMAGE/transfert-de-donnees(1).png';
import iconHOME2 from './IMAGE/envoyer.png';
import music from './IMAGE/note-de-musique.png';
import video from './IMAGE/video.png';
import photo from './IMAGE/photo.png';
import autre from './IMAGE/fichier.png';

const SERVER_URL = `http://${window.location.hostname}:5000`;

function Home() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [files, setFiles] = useState([]);
    const [waitingForUser, setWaitingForUser] = useState(true);
    const [localIp, setLocalIp] = useState('');
   
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const socket = io(SERVER_URL, { transports: ['websocket'] });

        socket.on('both-users-connected', () => {
            setWaitingForUser(false);
        });

        socket.on('file-uploaded', (newFileName) => {
            setFiles((prevFiles) => [...prevFiles, newFileName]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchLocalIp = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/local-ip`);
                const ip = response.data.localIp;
                setLocalIp(ip);
            
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'adresse IP locale:', error);
            }
        };

        fetchLocalIp();
    }, []);
          useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/generate-qr`);
                setQrCode(response.data.qrCode);
            } catch (error) {
                console.error('Erreur lors de la récupération du QR code:', error);
            }
        };

        fetchQRCode();
    }, [localIp]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'mp4':
            case 'mkv':
                return <img src={video} alt="Transfereo Icon" style={{ width: '26px', height: '26px' }} />;
            case 'mp3':
            case 'wav':
                return <img src={music} alt="Transfereo Icon" style={{ width: '26px', height: '26px' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <img src={photo} alt="Transfereo Icon" style={{ width: '26px', height: '26px' }} />;
            default:
                return <img src={autre} alt="Transfereo Icon" style={{ width: '26px', height: '26px' }} />;
        }
    };

    const uploadFile = async () => {
        if (!file) {
            setStatus('Veuillez sélectionner un fichier.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${SERVER_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStatus(`Fichier uploadé avec succès : ${response.data.fileName}`);
        } catch (error) {
            setStatus('Erreur lors de l\'upload du fichier.');
        }
    };

    const downloadFile = (fileName) => {
        window.location.href = `${SERVER_URL}/download/${fileName}`;
    };

    if (waitingForUser) {
        return (
            <div className="container-fluid vh-100 d-flex align-items-center p-0 bg-light">
                <img 
                    src={imageHOME} 
                    className="position-absolute" 
                    style={{
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: 'auto',
                        objectFit: 'cover'
                    }} 
                    alt="Home" 
                />
                <div className="container-fluid py-5 bg-light">
                    <div className="row w-100">
                        <div className="col-md-6 d-flex justify-content-center justify-content-md-start align-items-center">
                            <img 
                                src={iconHOME} 
                                alt="Transfereo Icon" 
                                className="img-fluid rounded-circle shadow-lg" 
                                style={{ width: '150px', height: '150px' }} 
                            />
                        </div>
                        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center text-md-end">
                            <h1 className="display-4 mb-3 text-primary fw-bold">
                                <img 
                                    src={iconHOME} 
                                    alt="Transfereo Icon" 
                                    style={{ width: '30px', height: '30px' }} 
                                /> Transfereo App
                            </h1> 
                            <p className="text-muted fs-5">Connectez-vous au même réseau Wi-Fi pour commencer.</p>

                            {localIp && (
                                <p className="text-muted fs-6">
                                    Scanner QR code ou entrer URL. : 
                                <strong className="text-dark">http://{localIp}:3000</strong>
                                <div className="text-center mb-3 " style={{marginTop:'1cm'}}>
                                {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />}
                            </div>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4 text-primary fw-bold">
                <img 
                    src={iconHOME} 
                    alt="Transfereo Icon" 
                    style={{ width: '30px', height: '30px' }} 
                /> Transfereo App
            </h1>
    
            <div className="mb-4">
                <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>
    
            <div className="d-grid gap-2 mb-4">
                <button className="btn btn-primary" onClick={uploadFile}>
                    <img 
                        src={iconHOME2} 
                        alt="Transfereo Icon" 
                        style={{ width: '30px', height: '30px' }} 
                    /> Envoyer le Fichier
                </button>
            </div>
    
            <p className="mt-3 text-success">{status}</p>
    
            <h2 className="mt-5 text-center text-secondary border-bottom pb-3 display-4">
                Fichiers Disponibles :
            </h2>

            <ul className="list-group mb-4">
                {files.length === 0 ? (
                    <li className="list-group-item text-muted text-center">Aucun fichier disponible</li>
                ) : (
                    files.map((fileName) => (
                        <li key={fileName} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{getFileIcon(fileName)} {fileName}</span>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => downloadFile(fileName)}>
                                Télécharger
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Home;
