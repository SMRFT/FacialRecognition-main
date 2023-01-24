import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft.png";
function Admin() {
    return (
        <div>
            <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
            <div className='main'></div>
            <div className='logo'>
                <img src={profile} className="smrft_logo" alt="logo" />
            </div>
            <NavbarComp />
        </div>
    );
}
export default Admin;