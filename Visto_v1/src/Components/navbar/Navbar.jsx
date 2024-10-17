import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Navbar.module.css';
import menu from '../../assets/menu.png';
import menub from '../../assets/menu (1).png';
import candidat from '../../assets/user.png';
import candidatb from '../../assets/user (1).png';
import post from '../../assets/briefcase (1).png';
import postb from '../../assets/briefcase.png';
import entretien from '../../assets/interview.png';
import entretienb from '../../assets/interview (1).png';
import settings from '../../assets/settings.png';
import settingsb from '../../assets/settings (1).png';
import logo from '../../assets/logoblue.png';

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    // Fetch the profile image URL from the backend
    axios.get('http://localhost:8086/recruteurs/imgprofile')
      .then(response => {
        const imageUrl = `http://localhost:8086/images/${response.data}`;
        setProfileImg(imageUrl);
      })
      .catch(error => {
        console.error('Error fetching profile image:', error);
      });
  }, []);

  useEffect(() => {
    // Update hovered state based on the URL
    if (location.pathname === '/AjoutCandidats') {
      setHovered('Candidats');
    } else {
      setHovered('');
    }
  }, [location.pathname]);

  const handleMouseEnter = (name) => setHovered(name);
  const handleMouseLeave = () => setHovered('');

  const handleProfileClick = () => setShowProfileMenu(!showProfileMenu);

  const handleClickOutside = (event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', defaultImg: menu, hoverImg: menub },
    { name: 'Candidats', path: '/candidats', defaultImg: candidat, hoverImg: candidatb },
    { name: 'Postes', path: '/postes', defaultImg: post, hoverImg: postb },
    { name: 'Entretiens', path: '/entretiens', defaultImg: entretien, hoverImg: entretienb },
  ];

  return (
    <>
      <div className={styles.container1}>
        <span
          className={`${styles.set} ${hovered === 'settingsSpan' ? styles.setHovered : ''}`}
          onMouseEnter={() => handleMouseEnter('settingsSpan')}
          onMouseLeave={handleMouseLeave}
          onClick={handleProfileClick}
          tabIndex={0}
        >
          <img
            src={profileImg ? profileImg : 'http://localhost:8086/images/defaultAvatar.png'}
            className={styles.profile}
            alt="Profile"
          />
          <img
            src={hovered === 'settingsSpan' ? settingsb : settings}
            className={styles.lset}
            alt="Settings"
          />
        </span>
        {showProfileMenu && (
          <div ref={profileMenuRef} className={styles.profileMenu}>
            <Link to="/profile" className={styles.profileMenuItem}>Voir Profile</Link>
            <Link to="/se_connecter" className={styles.profileMenuItem}>Déconnexion</Link>
          </div>
        )}
      </div>
      <div className={styles.container2}>
        <img src={logo} alt="logo" className={styles.logo} />
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path || hovered === item.name ? styles.containerHovered : ''}`}
            onMouseEnter={() => handleMouseEnter(item.name)}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
          >
            <img
              src={hovered === item.name || location.pathname === item.path ? item.hoverImg : item.defaultImg}
              alt={item.name}
              className={styles.llogo}
            />
            {item.name}
           
          </Link>
           
        ))}
      <div className={styles.rights}> © Developed By Moktar Bouatay </div>
      </div>
      
    </>
  );
}

export default Navbar;
