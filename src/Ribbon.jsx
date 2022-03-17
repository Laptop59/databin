import React from 'react';
import Tab from './Tab';

class Ribbon extends React.Component {
    render() {
        return (
            <div className="DataBinRibbon">
                <div className="DataBinTitleWrapper">
                    <span className="DataBinTitle">DataBin</span>
                </div>
                <div className="DataBinTabs">
                    <div className="DataBinTabsWrapper">
                        <Tab name="File" items={[

                        ]}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Ribbon;