
import Loader from 'react-loader-spinner';

const LoadingSpinner = ({ visible }) => {
    return (
        visible && (
            <div className="loading-spinner-wrapper">
                <Loader type="BallTriangle" color="#00BFFF" height={40} width={40}/>
            </div>   
        )
    )
}

export default LoadingSpinner;
