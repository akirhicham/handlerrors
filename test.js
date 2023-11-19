// This code will guide you on how this package works.

const QueryHandler = require('./handleerrors');
//Database Config
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_name',//Database name
};

const queryHandler = new QueryHandler(dbConfig);
//Query to be executed (example:Delete by ID)
const sampleQuery = 'Delete from table where ID=?';

const queryParams =[17];//parameter
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