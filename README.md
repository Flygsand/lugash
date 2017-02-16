# ![](http://i.imgur.com/FzNp8lw.png?1) Lugash

[![Build Status](https://travis-ci.org/wowgroup/lugash.svg?branch=master)](https://travis-ci.org/wowgroup/lugash)

Lightweight, Logstash-inspired event processing library for Node.

## Usage
```
npm install lugash
```

```js
// test.js
var line = require('lugash/decoders/line')
  , grok = require('lugash/filters/grok')
  , logstash = require('lugash/filters/logstash')
  , elasticsearch = require('lugash/encoders/elasticsearch');

process.stdin
  .pipe(line())
  .pipe(grok({
    match: {
      message: '%{IP:client} \\[%{TIMESTAMP_ISO8601:timestamp}\\] %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}'
    }
  }))
  .pipe(logstash())
  .pipe(elasticsearch())
  .pipe(process.stdout);
```
```
~ $ echo "1.2.3.4 [2016-03-15T12:42:04+11:00] GET /index.html 15824 0.043\n1.2.3.4 [2016-03-15T12:42:15+11:00] GET /index.html 17824 0.052" | node test.js
{"index":{"_index":"lugash-2016.03.15","_type":"logs"}}
{"@version":"1","@timestamp":"2016-03-15T01:42:04.000Z","message":"1.2.3.4 [2016-03-15T12:42:04+11:00] GET /index.html 15824 0.043","client":"1.2.3.4","timestamp":"2016-03-15T12:42:04+11:00","method":"GET","request":"/index.html","bytes":"15824","duration":"0.043"}
{"index":{"_index":"lugash-2016.03.15","_type":"logs"}}
{"@version":"1","@timestamp":"2016-03-15T01:42:15.000Z","message":"1.2.3.4 [2016-03-15T12:42:15+11:00] GET /index.html 17824 0.052","client":"1.2.3.4","timestamp":"2016-03-15T12:42:15+11:00","method":"GET","request":"/index.html","bytes":"17824","duration":"0.052"}
```

The `grok` filter patterns use the same Oniguruma-based syntax as Logstash. As such, Logstash patterns should be fully compatible with this library. For more information about writing `grok` patterns, please consult the [Logstash documentation](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html).

### I/O-agnostic
The API is 100% stream-based, which makes I/O straightforward. Lugash exposes Node-compatible [Highland](http://highlandjs.org/) streams.
