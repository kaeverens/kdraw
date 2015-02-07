(function($) {
	$.fn.kDraw=function(opts) {
		var options={
			'pen':{
				'colour':'#000',
				'width':1
			}
		};
		var $this=$(this);
		$this.click(function() {
			function cleanup() {
				$canvas.remove();
				$buttons.remove();
			}
			var w=$(window).width(), h=$(window).height();
			var rotate=h>w;
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
			function draw() {
				ctx.clearRect(0, 0, w, h);
				options=$.extend(options, opts);
				for (var i=0;i<layers.length;++i) {
					var layer=layers[i];
					console.log(layer);
					switch (layer.type) {
						default: // { line
							var p=layer.p;
							ctx.beginPath();
							ctx.moveTo(p[0][0], p[0][1]);
							for (var j=1;j<p.length;++j) {
								ctx.lineTo(p[j][0], p[j][1]);
							}
							ctx.stroke();
						break; // }
					}
				}
			}
			draw();
			function startDrawing(e) {
				var lastP=[e.offsetX, e.offsetY];
				var points=[lastP];
				function move(e) {
					var p=[e.offsetX, e.offsetY];
					points.push(p);
					ctx.beginPath();
					ctx.moveTo(lastP[0], lastP[1]);
					ctx.lineTo(p[0], p[1]);
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
		console.log(JSON.stringify(ps));
		var nps=[ps[0]];
		for (var i=1;i<ps.length-1;++i) {
			var same=false;
			if (ps[i-1][1]==ps[i][1]) {
				if (ps[i][1]==ps[i+1][1]) {
					same=true;
				}
			}
			else {
				if (ps[i][1]!=ps[i+1][1]) {
					var oAng=(ps[i-1][0]-ps[i][0])/(ps[i-1][1]-ps[i][1]);
					var nAng=(ps[i][0]-ps[i+1][0])/(ps[i][1]-ps[i+1][1]);
					if (oAng==nAng) {
						same=true;
					}
				}
			}
			if (!same) {
				nps.push(ps[i]);
			}
		}
		nps.push(ps[ps.length-1]);
		console.log(JSON.stringify(nps));
		return nps;
	}
})(jQuery);
