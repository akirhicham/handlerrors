const QueryHandler = require('./handllererror');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'arma_kpi',
};

const queryHandler = new QueryHandler(dbConfig);

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