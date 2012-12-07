/* -------------------------------------------------------------------------------------------- */
// copyright: Prime Design Works
// website: http://www.primedesignworks.com/
/* -------------------------------------------------------------------------------------------- */

$.extend({awake: {}});
$.fn.extend({
	wakeUp: function(option) {
		var defaults = {
			type: 'circle',
			color: 'rgb(255,255,255)',
			size: 30,
			speed: 50,
			clockwise: true,
			item: 12,
			itemSize: 2,
			phase: 10,
			fade: 500,
			fadeIn: true,
			fadeOut: true
		};
		var id = $(this).attr('id');
		$.awake[id] = {};
		$.awake[id] = $.extend(defaults, option);
		$.awake[id].id = id;
		$.awake[id].color = this.getColor($.awake[id].color);

		$(this).append('<canvas></canvas>');
		$.awake[id].e = $(this).find('canvas')[0];
		$.awake[id].c = $.awake[id].e.getContext('2d');
		$.awake[id].e.width = $.awake[id].size;
		$.awake[id].e.height = $.awake[id].size;
		$.awake[id].alphas = new Array();
		$.awake[id].end = false;
		$(this).find('canvas').fadeIn($.awake[id].fade);
		if ($.awake[id].fadeIn) $(this).find('canvas').css('display', 'none').fadeIn($.awake[id].fade);
		this['wakeUp_' + $.awake[id].type](id);
		return this;
	},
	getColor: function(color) {
		if (color.indexOf('rgb') != -1 || color.indexOf('hsl') != -1) {
			var loc1 = color.indexOf('(') + 1;
			var loc2 = color.indexOf(')');
			var key_color = (color.indexOf('rgb') != -1) ? 'rgb' : 'hsl';
			var this_color = color.substr(loc1, (loc2 - loc1)).split(',');
			if (this_color.length > 3) this_color.splice(3, 1);
			color = key_color + '('+ this_color.join(',') + ')';
		}
		return color;
	},
	wakeUp_circle: function(id) {
		var r = $().wakeUp_set(id, 'size');
		var w = Math.round($.awake[id].size * 0.1);
		var h = Math.round($.awake[id].size * 0.25);
		var rotate = ($.awake[id].clockwise) ? 360 / $.awake[id].item: -(360 / $.awake[id].item);

		for (var i = 0; i < $.awake[id].item; i++) {
			if ($.awake[id].alphas.length < $.awake[id].item) $.awake[id].alphas.push(i / ($.awake[id].item - 1));
			$.awake[id].c.fillStyle = $.awake[id].color;
			$.awake[id].c.globalAlpha = $.awake[id].alphas[i];
			$.awake[id].c.strokeStyle = "transparent";
			$.awake[id].c.beginPath();
			$.awake[id].c.moveTo(0 - w / 4, r - h);
			$.awake[id].c.quadraticCurveTo(0, r - h - w / 2, 0 + w / 4, r - h);
			$.awake[id].c.lineTo(0 + w / 2, r - w / 3);
			$.awake[id].c.quadraticCurveTo(0, r + w / 3, 0 - w / 2, r - w / 3);
			$.awake[id].c.closePath();
			$.awake[id].c.fill();
			$.awake[id].c.stroke();
			$.awake[id].c.rotate(rotate * Math.PI / 180);
		}
		$().wakeUp_alpha(id);
		$().wakeUp_loop(id);
	},
	wakeUp_dot: function(id) {
		var r = $().wakeUp_set(id, 'size');
		var rotate = ($.awake[id].clockwise) ? 360 / $.awake[id].item: -(360 / $.awake[id].item);

		for (var i = 0; i < $.awake[id].item; i++) {
			if ($.awake[id].alphas.length < $.awake[id].item) $.awake[id].alphas.push(i / ($.awake[id].item - 1));
			$.awake[id].c.beginPath();
			$.awake[id].c.arc(0, 0 - r + $.awake[id].itemSize, $.awake[id].itemSize, 0, 2 * Math.PI, false)
			$.awake[id].c.fillStyle = $.awake[id].color;
			$.awake[id].c.globalAlpha = $.awake[id].alphas[i];
			$.awake[id].c.fill();
			$.awake[id].c.rotate(rotate * Math.PI / 180);
		}
		$().wakeUp_alpha(id);
		$().wakeUp_loop(id);
	},
	wakeUp_line: function(id) {
		var r = $().wakeUp_set(id, 'size');
		var rotate = ($.awake[id].clockwise) ? 360 / $.awake[id].item: -(360 / $.awake[id].item);

		for (var i = 0; i < $.awake[id].item; i++) {
			if ($.awake[id].alphas.length < $.awake[id].item) $.awake[id].alphas.push(i / ($.awake[id].item - 1));
			$.awake[id].c.beginPath();
			$.awake[id].c.moveTo(0, 0 - r);
			$.awake[id].c.strokeStyle = $.awake[id].color;
			$.awake[id].c.lineTo(0, 0 - r + $.awake[id].itemSize);
			$.awake[id].c.globalAlpha = $.awake[id].alphas[i];
			$.awake[id].c.stroke();
			$.awake[id].c.rotate(rotate * Math.PI / 180);
		}
		$().wakeUp_alpha(id);
		$().wakeUp_loop(id);
	},
	wakeUp_beat: function(id) {
		var r = $().wakeUp_set(id);
		$().wakeUp_beat_before(id);

		$.awake[id].c.beginPath();
		$.awake[id].c.arc(0, 0, r * $.awake[id].alphas[$.awake[id].pos], 0, 2 * Math.PI, false)
		$.awake[id].c.fillStyle = $.awake[id].color;
		$.awake[id].c.globalAlpha = $.awake[id].alphas[$.awake[id].pos];
		$.awake[id].c.fill();

		$().wakeUp_beat_after(id);
		$().wakeUp_loop(id);
	},
	wakeUp_star: function(id) {
		var r = $().wakeUp_set(id);
		$().wakeUp_beat_before(id);

		$.awake[id].c.beginPath();
		$.awake[id].c.fillStyle = $.awake[id].color;
		$.awake[id].c.globalAlpha = $.awake[id].alphas[$.awake[id].pos];
		var theta = 72 * Math.PI / 180;
		$.awake[id].c.moveTo(0, (0 - r));
		$.awake[id].c.lineTo(Math.round(0 + r * Math.sin(2 * theta)), Math.round(0 - r * Math.cos(2 * theta)));
		$.awake[id].c.lineTo(Math.round(0 - r * Math.sin(theta)), Math.round(0 - r * Math.cos(theta)));
		$.awake[id].c.lineTo(Math.round(0 + r * Math.sin(theta)), Math.round(0 - r * Math.cos(theta)));
		$.awake[id].c.lineTo(Math.round(0 - r * Math.sin(2 * theta)), Math.round(0 - r * Math.cos(2 * theta)));
		$.awake[id].c.closePath();
		$.awake[id].c.fill();

		$().wakeUp_beat_after(id);
		$().wakeUp_loop(id);
	},
	wakeUp_heart: function(id) {
		var r = $().wakeUp_set(id);
		$().wakeUp_beat_before(id);

		$.awake[id].c.beginPath();
		$.awake[id].c.fillStyle = $.awake[id].color;
		$.awake[id].c.globalAlpha = $.awake[id].alphas[$.awake[id].pos];
		$.awake[id].c.moveTo(0, r * 0.7);
		$.awake[id].c.arcTo(r * 1.5, -r, r * 0.8, -r, r * 0.5);
		$.awake[id].c.quadraticCurveTo(0, -r, 0, -r / 2);
		$.awake[id].c.lineTo(0, r * 0.7);
		$.awake[id].c.arcTo(-r * 1.5, -r, -r * 0.8, -r, r * 0.5);
		$.awake[id].c.quadraticCurveTo(0, -r, 0, -r / 2);
		$.awake[id].c.closePath();
		$.awake[id].c.fill();

		$().wakeUp_beat_after(id);
		$().wakeUp_loop(id);
	},
	wakeUp_beat_before: function(id) {
		if ($.awake[id].alphas.length < $.awake[id].phase) {
			if ($.awake[id].alphas.length == 0) $.awake[id].pos = 0;
			$.awake[id].alphas.push($.awake[id].pos / ($.awake[id].phase - 1));
		}
	},
	wakeUp_beat_after: function(id) {
		if ($.awake[id].pos == 0) {
			$.awake[id].next = 1;
		} else if ($.awake[id].pos == $.awake[id].phase - 1) {
			$.awake[id].next = -1;
		}
		$.awake[id].pos += $.awake[id].next;
	},
	wakeUp_set: function(id) {
		var r = $.awake[id].size / 2;
		$.awake[id].c.setTransform(1, 0, 0, 1, r, r);
		$.awake[id].c.clearRect(-r, -r, (r * 2), (r * 2));
		return r;
	},
	wakeUp_alpha: function(id) {
		var last_alpha = $.awake[id].alphas[$.awake[id].item - 1];
		$.awake[id].alphas.pop();
		$.awake[id].alphas.splice(0, 0, last_alpha);
	},
	wakeUp_loop: function(id) {
		if ($.awake[id].end) {
			$('#' + $.awake[id].id).find('canvas').remove();
			delete $.awake[id];
			return this;
		} else {
			window.setTimeout(function() {$()['wakeUp_' + $.awake[id].type](id)}, $.awake[id].speed);
		}
	},
	goToBed: function() {
		var id = $(this).attr('id');
		if ($.awake[id].fadeOut) {
			$(this).find('canvas').fadeOut($.awake[id].fade, function() {
				var id = $(this).parent().attr('id');
				$.awake[id].end = true;
			});
		} else {
			$.awake[id].end = true;
		}
		return this;
	}
});
