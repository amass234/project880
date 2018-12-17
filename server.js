const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = next({ dir: '.', dev });
  const nextHandler = app.getRequestHandler();

  app.prepare()
    .then(() => {
      const server = express()

      if (!dev) {
        // Enforce SSL & HSTS in production
        server.use(function (req, res, next) {
          var proto = req.headers["x-forwarded-proto"];
          if (proto === "https") {
            res.set({
              'Strict-Transport-Security': 'max-age=31557600' // one-year
            });
            return next();
          }
          res.redirect("https://" + req.headers.host + req.url);
        });
      }

      // Static files
      // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
      server.use('/static', express.static(path.join(__dirname, 'static'), {
        maxAge: dev ? '0' : '365d'
      }));
    

      server.get('/novel-:e-:id', (req, res) => {
        const actualPage = '/episode'
        const queryParams = { id: req.params.id, e: req.params.e }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/edit-:e-:id', (req, res) => {
        const actualPage = '/editor-episode'
        const queryParams = { id: req.params.id, e: req.params.e }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/novel-:id', (req, res) => {
        const actualPage = '/novel'
        const queryParams = { id: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/new/:id', (req, res) => {
        const actualPage = '/new-episode'
        const queryParams = { id: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/editor/:id', (req, res) => {
        const actualPage = '/editor'
        const queryParams = { id: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/setting/tap?:id', (req, res) => {
        const actualPage = '/setting'
        const queryParams = { key: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })
      server.get('/author/:id', (req, res) => {
        const actualPage = '/author'
        const queryParams = { id: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })

      // Default catch-all renders Next app
      server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Listening on http://localhost:${port}`);
      });
    });
}