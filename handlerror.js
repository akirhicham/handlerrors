const mysql = require('mysql');

class QueryHandler {
    constructor(config) {
        this.connection = mysql.createConnection(config);
        this.errorSuggestions = [
            { code: 'ER_NO_SUCH_TABLE', suggestion: 'Make sure the table exists and the table name is correct.' },
            { code: 'ER_DUP_ENTRY', suggestion: 'Check for duplicate entries or provide a unique identifier.' },
            { code: 'ER_ROW_IS_REFERENCED_2', suggestion: 'Ensure that there are no foreign key constraints violating the update or delete operation.' },
            { code: 'ER_BAD_FIELD_ERROR', suggestion: 'Check the column names and ensure they are spelled correctly.' },
            { code: 'ER_PARSE_ERROR', suggestion: 'Review the SQL syntax and correct any syntax errors.' },
            { code: 'ER_ACCESS_DENIED_ERROR', suggestion: 'Check your username and password for the database connection.' },
            { code: 'ER_TABLE_EXISTS_ERROR', suggestion: 'Choose a different table name or drop the existing table.' },
            { code: 'ER_SYNTAX_ERROR', suggestion: 'Review the SQL syntax and correct any syntax errors.' },
            { code: 'ER_TOO_MANY_CONNECTIONS', suggestion: 'Check for unclosed connections and optimize connection usage.' },
            { code: 'ER_LOCK_WAIT_TIMEOUT', suggestion: 'Check for long-running transactions or optimize queries.' },
        ];
    }

    executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    const errorMessage = `Query execution error: ${err.message}`;

                    // Check if the error code is in the array of errorSuggestions
                    const matchedError = this.errorSuggestions.find(errorObj => errorObj.code === err.code);

                    let suggestion = matchedError ? matchedError.suggestion : 'An error occurred.';

                    return reject(`${errorMessage}\nSuggestion: ${suggestion}`);
                }

                console.log('Query executed successfully:', results);
                resolve('Query executed successfully');
            });
        });
    }

    closeConnection() {
        this.connection.end((err) => {
            if (err) {
                console.error('Error closing the database connection:', err);
            }
        });
    }
}

module.exports = QueryHandler;
