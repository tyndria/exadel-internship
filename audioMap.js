module.exports.AUDIO_MAP = (function() {
	var MAP = {};
	return {
		set: function(originalName, fileName) {
			MAP[originalName] = fileName;
		},
		get: function(originalName) {
			return MAP[originalName];
		}
	}
})()