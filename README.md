# transport.opendata.ch-data.tpg.ch

![Demo](/demo.png)

Tool to create a lookup table between SBB stops names and TPG stops names

## How to use ?

```
git clone https://github.com/Nicolapps/transport.opendata.ch-data.tpg.ch.git
cd transport.opendata.ch-data.tpg.ch/
npm install
```

Then edit the `config.js` file to specify your database credentials and your [TPG open data](http://data.tpg.ch/) API key.

To start, just type `node main.js`.

You can use the SQL dump instead (`dump.sql` file). It includes some corrections.
