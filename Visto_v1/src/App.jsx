import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Candidats from './Components/Candidats/Candidats'; // Importez vos autres pages ici
import Postes from './Components/Postes/Postes';
import Entretiens from './Components/Entretien/Entretien';
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import './App.css'
import Dashboard from './Components/Dashboard/Dashboard';
import Profile from './Components/Profile/Profile';
import AjoutCandidats from './Components/AjoutCandidats/AjoutCandidats';
import OffreEmploi from './Components/OffreEmploi/OffreEmploi';


function App() {
  return (
    <Router>    
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/candidats" element={<Candidats />} />
        <Route path="/postes" element={<Postes />} />
        <Route path="/entretiens" element={<Entretiens />} />
        <Route path="/se_connecter" element={<Login />}/>
        <Route path="/s'inscrire" element={<Signup />}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/AjoutCandidats' element={ <AjoutCandidats />} />
        <Route path="/OffreEmploi/:id" element={<OffreEmploi />} /> 
        {/* Ajoutez d'autres routes ici */}
      </Routes>
    </Router>
  );
}

export default App;
