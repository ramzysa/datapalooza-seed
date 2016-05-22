var express = require('express');
var router = express.Router();
var multer  = require('multer');
var cloudant = require('../lib/cloudant-access');

var postsdb = cloudant.db.use('posts');

router.get('/', (req, res) => {
	postsdb.list({ include_docs : true }, function(err, posts) {
		var response = !posts.rows ? [] : posts.rows.map(function(row) {
			return row.doc;
		});
		res.json(response);
	});
});

router.post('/', (req, res) => {
	postsdb.insert(req.body, function(err, savedPost) {
		res.status(201).location('/' + savedPost.id).send(savedPost);
	});
});

router.get('/:postId', (req, res) => {
	postsdb.get(req.params.postId, function(err, foundPost) {
		res.status(foundPost ? 200 : 404).json(foundPost);
	});
});

router.delete('/:postId', (req, res) => {
	postsdb.destroy(req.params.postId, req.query.rev, function(err, data) {
		res.status(200).send();
	});
});

router.get('/:postId/image', (req, res) => {
	postsdb.attachment.get(req.params.postId, 'IMAGE').pipe(res);
});

router.put('/:postId/image', multer().any(), (req, res, next) => {
	var imageFile = req.files[0];
	var buffer = imageFile.buffer;
	var mimetype = imageFile.mimetype;
	var fileName = imageFile.originalname;
	postsdb.get(req.params.postId, function(err, foundPost) {
		if (err) {
			next(err);
		} else {
			postsdb.attachment.insert(req.params.postId, 'IMAGE', buffer, mimetype, { rev : foundPost._rev }, (err, body) => {
				if (err) {
					return next(err);
				}
				res.status(200).json({});
			});
		}
	});
});

module.exports = router;
