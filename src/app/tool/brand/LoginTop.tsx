import logo from './img/logo.svg';

export function LoginTop() {
    return <div className="d-flex align-items-center position-relative">
        <img className="App-logo h-3c position-absolute" src={logo} alt="img" />
        <div className="h3 flex-fill text-center"><span className="text-primary me-3">同</span>
            <span className="text-danger">花</span>
        </div>
    </div>;
}
