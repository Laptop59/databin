import React, {Suspense} from "react";

const Image = props => {
    if (!props.src) return "No image";
    let I = React.lazy(() => import("./" + props.src));
    return <Suspense fallback={<></>}>
        <I/>
    </Suspense>;
}

export default Image;