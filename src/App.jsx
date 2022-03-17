import React from 'react';
import Toolbox from './Toolbox';
import Ribbon from './Ribbon';
import Structure from './Structure';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: {
                LOL: {
                    type: 'byte',
                    value: 69
                },
                Life: {
                    type: 'byte',
                    value: 420
                },
                zero: {
                    type: 'byte',
                    value: 12
                },
                bit: {
                    type: 'bit',
                    value: true
                },
                hey: {
                    type: 'double',
                    value: 4922.91921
                },
                pack: {
                    type: 'package',
                    value: {
                        data1: {
                            type: 'double',
                            value: Infinity
                        },
                        pack2: {
                            type: 'package',
                            value: {
                                1: {
                                    type: 'bit',
                                    value: true
                                },
                                2: {
                                    type: 'byte',
                                    value: 2
                                }
                            }
                        },
                        data2: {
                            type: 'bit',
                            value: true
                        },
                        data3: {
                            type: 'double',
                            value: 420.69
                        }
                    }
                },
                notEndYet: {
                    type: 'bit',
                    value: false
                }
            }
        }
    }

    render() {
        return (
            <div className="DataBinApp">
                <Ribbon/>
                <Toolbox/>
                <Structure tags={this.state.tags}/>
            </div>
        );
    }
}

export default App;