import React from 'react'
import styles from './ProgressBar.module.css'
import img from '../../assets/briefcase.png'

function ProgressBar() {
  return (
    <>
     <div className={styles.pbcontainer}>Postes disponibles</div>
     <div className={styles.nbr}>48 <span><img src={img} className={styles.img} alt="" /></span></div>
    </>
   
  )
}

export default ProgressBar