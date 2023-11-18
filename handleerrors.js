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
            { code: 'ER_NO_DEFAULT', suggestion: 'Provide a default value for the column in your INSERT statement.' },
            { code: 'ER_SERVER_SHUTDOWN', suggestion: 'Check if the MySQL server is running and accessible.' },
            { code: 'ER_UNKNOWN_HOST', suggestion: 'Verify the hostname in your database connection configuration.' },
            { code: 'ER_CANT_CREATE_FILE', suggestion: 'Ensure that the MySQL server has the necessary permissions to create files.' },
            { code: 'ER_QUERY_INTERRUPTED', suggestion: 'Re-run the query after resolving any network or server interruptions.' },
            { code: 'ER_SUBQUERY_NO_1_ROW', suggestion: 'Make sure your subquery returns only one row or use a different type of subquery.' },
            { code: 'ER_TABLE_MUST_HAVE_COLUMNS', suggestion: 'Define at least one column for your table when creating it.' },
            { code: 'ER_UNKNOWN_STORAGE_ENGINE', suggestion: 'Check if the storage engine specified for your table is supported or spelled correctly.' },
            { code: 'ER_SP_NOT_VAR_ARG', suggestion: 'Ensure that stored procedures with OUT or INOUT parameters have a variable number of arguments.' },
            { code: 'ER_DUP_UNIQUE', suggestion: 'Check for duplicate unique keys in your table.' },
            { code: 'ER_NO_SUCH_USER', suggestion: 'Verify that the user specified in your GRANT statement exists.' },
            { code: 'ER_WRONG_NUMBER_OF_COLUMNS_IN_SELECT', suggestion: 'Match the number of columns in your SELECT statement with the number of columns returned.' },
            { code: 'ER_HOSTNAME_UNKNOWN', suggestion: 'Verify the hostname in your MySQL user account or connection string.' },
            { code: 'ER_TRUNCATED_WRONG_VALUE', suggestion: 'Check the data type of the column and ensure it can accommodate the value being inserted or updated.' },
            { code: 'ER_TABLENAME_NOT_ALLOWED_HERE', suggestion: 'Review your SQL statement and ensure the table name is used in a valid context.' },
            { code: 'ER_WRONG_AUTO_KEY', suggestion: 'Verify the use of AUTO_INCREMENT for the primary key column in your table.' },
            { code: 'ER_TOO_MANY_DELAYED_THREADS', suggestion: 'Consider optimizing your use of the DELAYED option in your INSERT statements.' },
            { code: 'ER_ROW_IS_REFERENCED', suggestion: 'Ensure that there are no foreign key constraints violating the update or delete operation.' },
            { code: 'ER_QUERY_CACHE_DISABLED', suggestion: 'Check if the query cache is disabled in your MySQL server configuration.' },
            { code: 'ER_VIEW_SELECT_DERIVED', suggestion: 'Use a temporary table to store the result of your SELECT statement in the view definition.' },
            { code: 'ER_BAD_DB_ERROR', suggestion: 'Check if the specified database exists or if there are typos in the database name.' },
            { code: 'ER_NO_REFERENCED_ROW_2', suggestion: 'Ensure that the foreign key references an existing unique key in the referenced table.' },
            { code: 'ER_QUERY_ON_MASTER', suggestion: 'Avoid running read-only queries on a MySQL master server.' },
            { code: 'ER_NON_UNIQ_ERROR', suggestion: 'Ensure that all SELECTed columns in your query have unique names or aliases.' },
            { code: 'ER_NOT_SUPPORTED_YET', suggestion: 'Check the MySQL documentation for the version you are using, as the feature may not be supported yet.' },
            { code: 'ER_WRONG_VALUE_COUNT_ON_ROW', suggestion: 'Match the number of values in your INSERT statement with the number of columns in the table.' },
            { code: 'ER_UNKNOWN_CHARACTER_SET', suggestion: 'Check if the character set specified for the database or table is supported or spelled correctly.' },
            { code: 'ER_SYNTAX_ERROR', suggestion: 'Review the SQL syntax and correct any syntax errors.' },
            { code: 'ER_NO_REFERENCED_ROW', suggestion: 'Ensure that the foreign key references an existing unique key in the referenced table.' },
            { code: 'ER_PASSWORD_NO_MATCH', suggestion: 'Check that the provided password matches the one stored for the specified user.' },
            { code: 'ER_KEY_NOT_FOUND', suggestion: 'Ensure that the specified key exists in the table or index.' },
            { code: 'ER_UNKNOWN_COLLATION', suggestion: 'Check if the collation specified for the database or table is supported or spelled correctly.' },
            { code: 'ER_MULTIPLE_PRI_KEY', suggestion: 'Remove duplicate PRIMARY KEY declarations in your CREATE TABLE statement.' },
            { code: 'ER_TABLEACCESS_DENIED_ERROR', suggestion: 'Check the privileges of the MySQL user account for accessing the specified table.' },
            { code: 'ER_FIELD_SPECIFIED_TWICE', suggestion: 'Review your SQL statement and remove any duplicate column references.' },
            { code: 'ER_CON_COUNT_ERROR', suggestion: 'Check the maximum number of connections allowed for your MySQL server configuration.' },
            { code: 'ER_DUP_ENTRY_WITH_KEY_NAME', suggestion: 'Check for duplicate entries and provide a unique key name.' },
            { code: 'ER_NO_DEFAULT_FOR_FIELD', suggestion: 'Provide a default value for the specified column in your CREATE TABLE statement.' },
            { code: 'ER_TOO_BIG_DISPLAYWIDTH', suggestion: 'Reduce the display width of the column in your CREATE TABLE statement.' },
            { code: 'ER_TABLE_NOT_LOCKED', suggestion: 'Ensure that the table is locked before performing the specified operation.' },
            { code: 'ER_WARN_QC_RESIZE', suggestion: 'Check if the query cache is configured optimally for your workload.' },
            { code: 'ER_SP_ALREADY_EXISTS', suggestion: 'Choose a different name for your stored procedure, as the specified name already exists.' },
            { code: 'ER_BINLOG_CREATE_ROUTINE_NEED_SUPER', suggestion: 'Ensure that the MySQL user account creating the routine has the SUPER privilege.' },
            { code: 'ER_UNKNOWN_PROCEDURE', suggestion: 'Check if the specified stored procedure exists or if there are typos in the procedure name.' },
            { code: 'ER_STMT_HAS_NO_OPEN_CURSOR', suggestion: 'Ensure that a cursor is open before performing the FETCH operation in your stored procedure.' },
            { code: 'ER_OLD_FILE_FORMAT', suggestion: 'Upgrade your MySQL server to a version that supports the current file format.' },
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
                    exit;
                }

                console.log('Query executed successfully:', results);
                resolve('Query executed successfully');
            });
        });
    }

    closeConnection() {
    }
}

module.exports = QueryHandler;
