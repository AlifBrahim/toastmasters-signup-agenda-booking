import Spinner from "react-spinners/BounceLoader";

function Loader() {


    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}>


            <Spinner
                color='#000000'
                loading='true'
                size='150px'
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default Loader;
