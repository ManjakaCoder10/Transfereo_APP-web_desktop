// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingPage from './component/LoadingPage';
import Home from './component/home';




function App() {
  const [textIndex, setTextIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((index) => index + 1);
      setImageIndex((index) => (index + 1) );
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, []);

  return (
    <div className="App">
     {loading ? ( <LoadingPage textIndex={textIndex} imageIndex={imageIndex} />
     ) : (<div> <Home  /> </div>)}
    </div>
    
  );
}

export default App;
