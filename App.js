/**
 * Foloosi Payment React Native
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Dimensions,
  BackHandler   
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            reference_token: "",
            merchant_key: "test_$2y$10$nBFlhIbZ0xA1A0.-MPvoP.v45N5oiAJeBPomyWw-dya-GEUtqZKiy", 
            canGoBack: false,
            check_reference_token:false
        };
    }

    componentDidMount() {
        this.getReferenceToken();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    getReferenceToken = () => {
        axios({
            method: 'post',
            url: 'https://foloosi.com/api/v1/api/initialize-setup',
            headers: {
                'merchant_key': this.state.merchant_key
            },
            data: {
                transaction_amount: "10.00",
                currency: "AED",
                customer_name: "Muthu kumar",
                customer_email: "muthu@test.com",
                customer_mobile: "9876543210",
                customer_address: "United Arab Emirates",
                customer_city: "Abu Dhabi"
            }
        }).then((response) => {
            console.log("Token :", response.data.data["reference_token"]);            
            this.setState({reference_token: response.data.data["reference_token"]}, () => {                
                this.setState({check_reference_token:true});
            });
            return response.data.data["reference_token"];
        }).catch(function (error) {
            return error
        });
    };


    onMessage(event){
        console.log(event.nativeEvent.data);
        const response = JSON.parse(event.nativeEvent.data);
        if (response.status == 'success') {
            //Here you can process for Successfull transaction
            console.log('payment success');
        } else {
            console.log('payment failed');
        }
    }


    handleBackPress = () => {
        return true;
    };
    
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack
        });
    } 
    render() {

        const reference_token = this.state.reference_token;
        return (            
            <View style={{ height: height, width: width,overflow:'hidden' }}>   
                {this.state.check_reference_token ?                 
                        <WebView 
                            source={{uri:`https://widget.foloosi.com/?{"reference_token":"${reference_token}","secret_key":"${this.state.merchant_key}"}`}}
                            style={{flex: 1, height: height}}
                            domStorageEnabled={true}
                            javaScriptEnabled={true}
                            useWebKit={true}
                            thirdPartyCookiesEnabled={true}
                            allowUniversalAccessFromFileURLs={true}
                            startInLoadingState={true}
                            scrollEnabled={true}
                            mixedContentMode={'always'}
                            onError={err => console.log('Error:', err)}
                            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                            onMessage={this.onMessage}
                        />
                    : null
                }
            </View>
        );
    }
}

export default App;