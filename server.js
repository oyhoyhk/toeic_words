const http = require('http');
const url = require('url');
const fs = require('fs');
fs.open(__dirname + '/list.json', 'a', (err, fd) => {
	if (err) {
		console.error(err);
		fs.close(fd);
	}
});
http.createServer((req, res) => {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
		'Access-Control-Max-Age': 2592000, // 30 days
		/** add other headers as per requirement */
	};
	const path = req.url;
	if (req.method === 'GET') {
		res.writeHead(200, headers);

		fs.readFile(__dirname + '/list.json', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			if (!data.toString()) {
				res.end();
			} else {
				res.end(data.toString());
			}
		});
	}
	if (req.method === 'POST') {
		if (req.url === '/') {
			req.setEncoding('utf-8');
			req.on('data', function (data) {
				const newWord = data.split('-');
				fs.readFile(__dirname + '/list.json', (err, list) => {
					if (err) {
						return console.error(err);
					}
					const words = list.toString() ? JSON.parse(list.toString()) : {};
					if (words[newWord[0]]) {
						res.writeHead(200, headers);
						res.write('existing');
						res.end();
					} else {
						words[newWord[0]] = newWord[1];
						fs.writeFile(__dirname + '/list.json', JSON.stringify(words), 'utf8', function (err) {
							if (err) {
								console.log(err);
							}
							res.writeHead(200, headers);
							res.write('enroll success');
							res.end();
						});
					}
				});
			});
		} else if (req.url === '/delete') {
			req.setEncoding('utf-8');
			req.on('data', function (data) {
				fs.readFile(__dirname + '/list.json', (err, list) => {
					if (err) {
						return console.error(err);
					}
					const words = JSON.parse(list.toString());
					delete words[data];
					fs.writeFile(__dirname + '/list.json', JSON.stringify(words), 'utf8', function (err) {
						if (err) {
							console.log(err);
						}
						res.writeHead(200, headers);
						res.write('enroll success');
						res.end();
					});
				});
			});
		}
	}
}).listen(8000);
