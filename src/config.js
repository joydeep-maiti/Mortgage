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
    url: "https://json-server-mortgage.herokuapp.com"
    // url: "https://mortgagejsonserver.herokuapp.com"
};

// const Data = prod;
const Data = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;

const interestRate = {
    Gold: '11',
    Car: '12',
    property: '10'
}
export {
    // Add common config values here
    Data
};
