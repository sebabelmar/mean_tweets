angular.module('TweeterDirective', [])
	.directive('tweeterViz', [
		'd3', '$window',
		function(d3, $window) {
			return {
				restrict: 'E',
				scope: {
					data: '=?'
				},
				template: '<div class="infobox" id="data-info""></div><div class="twitterviz"></div><br>',
				link: function(scope, element, attrs) {

					// ----- BUBBLE PLOT -----
					// infobox code
					// this will be ran whenever we mouse over a circle
					var myMouseOverFunction = function() {
						var node = d3.select(this);
						// show infobox div on mouseover.
						// block means sorta "render on the page" whereas none would mean "don't render at all"
						d3.select(".infobox").style("display", "block");
						// add test to p tag in infobox
						d3.select("#data-info")
							.text(this.__data__.cluster + ' represents ' +  this.__data__.tweets_percentage + '% of the total.');
					};

					var myMouseOutFunction = function() {
						var circle = d3.select(this);
						// display none removes element totally, whereas visibilty in last example just hid it
						d3.select(".infobox").style("display", "block");
					};

					var ageWidth          = 900,
					    ageHeight         = 400,
					    agePadding        = 1.5, // separation between same-color nodes
					    ageClusterPadding = 6, // separation between different-color nodes
					    ageMaxRadius      = 1000;


					// what about creating a structure like this but jsonic style in order to do not perform any
					// logic on the viualization side

					scope.$watch('data', function(d) {
						if (d.length)
							update(d)
					});
					
					function update(data) {
						
						console.log(data);

						var counter = 0;

						var n = data.length,  // total number of nodes
						    m = 5;                  // number of distinct clusters for us age groups

						var color = d3.scale.category20()
							.domain(d3.range(m));

						// The largest node for each cluster.
						var clusters = new Array(m);

						var nodes = d3.range(n).map(function() {
							var i = data[counter]._id;
							var percentage = data[counter].totalCount/29353;
							var r = percentage*(ageMaxRadius + 1);
							var d = {
								tweets_percentage: Math.floor(percentage*10000) /100,
								cluster: i,
								radius: r,
								x: Math.cos(i/m*2*Math.PI)*200 + ageWidth/2 + Math.random(),
								y: Math.sin(i/m*2*Math.PI)*200 + ageHeight/2 + Math.random()
							};

							counter += 1;
							if(!clusters[i] || (r>clusters[i].radius)) clusters[i] = d;
							return d
						});

						var force = d3.layout.force()
							.nodes(nodes)
							.size([ageWidth, ageHeight])
							.gravity(.02)
							.charge(0)
							.on("tick", ageTick)
							.start();

						var svg = d3.select(".twitterviz").append("svg")
							.attr("width", ageWidth)
							.attr("height", ageHeight);

						var node = svg.selectAll("circle")
							.data(nodes)
							.enter().append("circle")
							.style("fill", function(d) { return color(d.cluster); })
							.on("mouseover", myMouseOverFunction)
							.on("mouseout", myMouseOutFunction)
							.call(force.drag);

						node.transition()
							.duration(750)
							.delay(function(d, i) { return i*5; })
							.attrTween("r", function(d) {
								var i = d3.interpolate(0, d.radius);
								return function(t) { return d.radius = i(t); };
							});

						function ageTick(e) {
							node
								.each(cluster(10*e.alpha*e.alpha))
								.each(collide(.5))
								.attr("cx", function(d) { return d.x; })
								.attr("cy", function(d) { return d.y; });
						}

						// Move d to be adjacent to the cluster node.
						function cluster(alpha) {
							return function(d) {
								var cluster = clusters[d.cluster];
								if(cluster === d) return;
								var x = d.x - cluster.x,
								    y = d.y - cluster.y,
								    l = Math.sqrt(x*x + y*y),
								    r = d.radius + cluster.radius;
								if(l != r) {
									l = (l - r)/l*alpha;
									d.x -= x *= l;
									d.y -= y *= l;
									cluster.x += x;
									cluster.y += y;
								}
							};
						}

						// Resolves collisions between d and all other circles.
						function collide(alpha) {
							var quadtree = d3.geom.quadtree(nodes);
							return function(d) {
								var r   = d.radius + ageMaxRadius + Math.max(agePadding, ageClusterPadding),
								    nx1 = d.x - r,
								    nx2 = d.x + r,
								    ny1 = d.y - r,
								    ny2 = d.y + r;
								quadtree.visit(function(quad, x1, y1, x2, y2) {
									if(quad.point && (quad.point !== d)) {
										var x = d.x - quad.point.x,
										    y = d.y - quad.point.y,
										    l = Math.sqrt(x*x + y*y),
										    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster
												    ? agePadding
												    : ageClusterPadding);
										if(l<r) {
											l = (l - r)/l*alpha;
											d.x -= x *= l;
											d.y -= y *= l;
											quad.point.x += x;
											quad.point.y += y;
										}
									}
									return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
								});
							};
						}

					}
					
				}


			}
		}
	]);


