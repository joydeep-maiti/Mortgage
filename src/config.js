// let URL = "http://localhost:4000"
// if (process.env.REACT_APP_STAGE === 'development') {
//     console.log("jjjjjjjjjjbbbbbb")
//     URL = "http://localhost:4000"
// }
// if (process.env.REACT_APP_STAGE === 'production') {
//     URL = "https://my-json-server-deploy.herokuapp.com"
// }

const dev = {
    // url: "https://json-server-mortgage.herokuapp.com"
    url : "http://localhost:4000"

};

const prod = {
    //url: "https://json-server-mortgage.herokuapp.com"
    url:"https://mortgagejsonserver.herokuapp.com"
    // url: "https://mortgagejsonserver.herokuapp.com"
};

const Data = dev;
// const Data = process.env.REACT_APP_STAGE === 'production'
//     ? prod
//     : dev;

const interestRate = {
    Gold: '11',
    Car: '12',
    property: '10'
}

const firebaseConfig = {
    apiKey: "AIzaSyCf6Z-WrHMGMITKf8b7geSUwn_WiEBEhQI",
    authDomain: "test-43f6f.firebaseapp.com",
    databaseURL: "https://test-43f6f.firebaseio.com",
    projectId: "test-43f6f",
    storageBucket: "test-43f6f.appspot.com",
    messagingSenderId: "684509013643",
    appId: "1:684509013643:web:af79646532e4ee527b968e",
    measurementId: "G-1WWK4TC39B"
};

export {
    // Add common config values here
    Data,
    firebaseConfig
};
