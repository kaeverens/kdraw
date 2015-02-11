(function($) {
	$.fn.kDraw=function(opts) {
		var options={
			'pen':{
				'colour':'#000',
				'width':1,
				'rotate':function() {
					var w=$(window).width(), h=$(window).height();
					return h>w;
				}
			}
		};
		var $this=$(this);
		$this.click(function() {
			function cleanup() {
				$canvas.remove();
				$buttons.remove();
			}
			var w=$(window).width(), h=$(window).height(), rotate=0;
			var cw=w, ch=h;
			var $canvas=$('<canvas width="'+w+'" height="'+h+'" style="position:fixed;left:0;top:0;right:0;bottom:0;background:#fff;"/>')
				.appendTo('body');
			// { initialise ctx settings
			var ctx=$canvas[0].getContext('2d');
			ctx.strokeStyle=options.pen.colour;
			ctx.lineWidth=options.pen.width;
			// }
			// { bottom buttons
			var $buttons=$('<div style="position:fixed;right:5px;bottom:5px;"/>')
				.appendTo('body');
			$('<button>Cancel</button>')
				.click(function() {
					cleanup();
				})
				.appendTo($buttons);
			$('<button>Reset</button>')
				.click(function() {
					cleanup();
					$this.click();
				})
				.appendTo($buttons);
			$('<button>Clear</button>')
				.click(function() {
					layers=[];
					draw();
				})
				.appendTo($buttons);;
			$('<button>OK</button>')
				.click(function() {
					$this.find('input')
						.val(JSON.stringify(layers));
					cleanup();
				})
				.appendTo($buttons);
			// }
			var layers=JSON.parse($this.find('input').val()||'[]');
			function rotatePoints(x, y) {
				return rotate
					?[w-y, x]
					:[x, y];
			}
			function unRotatePoints(x, y) {
				return rotate
					?[y, ch-x]
					:[x, y];
			}
			function ctxMoveTo(x, y) {
				var ps=rotatePoints(x, y);
				ctx.moveTo(ps[0], ps[1]);
			}
			function ctxLineTo(x, y) {
				var ps=rotatePoints(x, y);
				ctx.lineTo(ps[0], ps[1]);
			}
			function draw() {
				ctx.clearRect(0, 0, w, h);
				options=$.extend(options, opts);
				rotate=options.rotate();
				cw=rotate?h:w;
				ch=rotate?w:h;
				for (var i=0;i<layers.length;++i) {
					var layer=layers[i];
					console.log(layer);
					switch (layer.type) {
						default: // { line
							var p=layer.p;
							ctx.beginPath();
							ctxMoveTo(p[0][0], p[0][1]);
							for (var j=1;j<p.length;++j) {
								ctxLineTo(p[j][0], p[j][1]);
							}
							ctx.stroke();
						break; // }
					}
				}
			}
			draw();
			function startDrawing(e) {
				var lastP=unRotatePoints(e.offsetX, e.offsetY);
				var points=[lastP];
				function move(e) {
					var p=unRotatePoints(e.offsetX, e.offsetY);
					points.push(p);
					ctx.beginPath();
					ctxMoveTo(lastP[0], lastP[1]);
					ctxLineTo(p[0], p[1]);
					ctx.stroke();
					lastP=p;
				}
				function up() {
					$canvas.unbind('mousemove', move);
					$canvas.unbind('mouseup', up);
					layers.push({
						'p':_optimise(points)
					});
					console.log(JSON.stringify(layers));
				}
				$canvas.mousemove(move);
				$canvas.mouseup(up);
			}
			$canvas.mousedown(startDrawing);
			return false;
		});
	};
	function _optimise(ps) {
		var ps2=[ps[0]];
		for (var i=1;i<ps.length;++i) { // remove duplicate points from lines
			if (ps[i-1][0]!=ps[i][0] || ps[i-1][1]!=ps[i][1]) {
				ps2.push(ps[i]);
			}
		}
		var ps3=[ps[0]];
		for (var i=1;i<ps2.length-1;++i) {
			var same=false;
			if (ps2[i-1][1]==ps2[i][1]) {
				if (ps2[i][1]==ps2[i+1][1]) {
					same=true;
				}
			}
			else {
				if (ps2[i][1]!=ps2[i+1][1]) {
					var oAng=(ps2[i-1][0]-ps2[i][0])/(ps2[i-1][1]-ps2[i][1]);
					var nAng=(ps2[i][0]-ps2[i+1][0])/(ps2[i][1]-ps2[i+1][1]);
					if (oAng==nAng) {
						same=true;
					}
				}
			}
			if (!same) {
				ps3.push(ps2[i]);
			}
		}
		ps3.push(ps2[ps2.length-1]);
		console.log(JSON.stringify(ps));
		console.log(JSON.stringify(ps2));
		console.log(JSON.stringify(ps3));
		return ps3;
	}
})(jQuery);
