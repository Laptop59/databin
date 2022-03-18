import { useRef } from 'react';

const FileInput = props => {
    const input = useRef(null);

    return (
        <input
            type="file"
            id="DataBinInputFileButton"
            onChange={(e) => props.onChange(e.target.files)}
            accept=".dbin"
            ref={input}
            style={{
                display: 'none'
            }}
        />
    );
};

export default FileInput;