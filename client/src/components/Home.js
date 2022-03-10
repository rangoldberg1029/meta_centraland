import '../App.css'


export default function Home() {
    const logOut = () => {
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        localStorage.setItem('name', '');
        localStorage.setItem('balance', '0');
    }

    return (
        <div className="row ">
            <h1 className='row-h1'>Wellcome to Meta Centraland</h1>
            <h3 className='row-h3 '>Sign In or Create an Account</h3>
            <div className="col-sm-4  ">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Play using your wallet</h5>
                        <img className="card-img-top" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3vY-UfK7IVT8BMI6KvjooVYDCBinPbfZZ0mX0nVBR9RrEtmtK_13jCOP7MbJc0mu8X-Q&usqp=CAU' alt='sale'></img>
                        <a href='/login' className="btn btn-primary" >Continue with wallet</a>
                    </div>
                </div>
            </div>
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body ">
                        <h5 className="card-title">Play as a guest</h5>
                        <img className="card-img" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUD9g9NE-zJB46jcJOvOEqUihOvQuSVhL7rw&usqp=CAU' alt='guest'></img>
                        <a href="/main" className="btn btn-primary" onClick={logOut}>Continue as guest</a>
                    </div>
                </div>
            </div>
        </div>
    )

}


