import { Blocks } from "react-loader-spinner";

function Loader() {
  return (
    <Blocks
      visible={true}
      height="80"
      width="80"
      ariaLabel="blocks-loading"
      wrapperStyle={{ position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"}}
      wrapperClass="blocks-wrapper"
    />
  );
}

export default Loader;
