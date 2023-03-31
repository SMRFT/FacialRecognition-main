// import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft.png";
import profile1 from "./images/smrft(1).png";
import Footer from './Components/Footer';
import './Components/Footer.css';
function Admin() {
    return (
        <div>
            <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
            <div className='main'></div>
            <div className='logo'>
                <img src={profile1} className="smrft_logo" alt="logo" />
            </div>
            <NavbarComp />

            {/* <Footer /> */}
        </div>
        
    );
}
export default Admin;