const QueryHandler = require('./handleerrors');
//Database Config
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'armas_kpi',//Database name
};

const queryHandler = new QueryHandler(dbConfig);
//Query to be executed (example:Delete by ID)
const sampleQuery = 'Delete from Indicators where IndicatorID=?';

const queryParams =[17];
queryHandler.executeQuery(sampleQuery, queryParams)
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error(error); 
    })
    .finally(() => {
        queryHandler.closeConnection();
    });