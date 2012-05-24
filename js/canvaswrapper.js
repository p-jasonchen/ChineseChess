/*
* Copyright (c) 2011 Róbert Pataki
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* ----------------------------------------------------------------------------------------
*
* Check out my GitHub:	http://github.com/heartcode/
* Send me an email:		heartcode@robertpataki.com
* Follow me on Twitter:	http://twitter.com/#iHeartcode
* Blog:					http://heartcode.robertpataki.com
*/

/**
 * CanvasWrapper uses the HTML5 canvas element in modern browsers and VML in IE6/7/8 to create and animate the most popular preloader shapes (oval, spiral, rectangle, square and rounded rectangle).<br/><br/>
 * It is important to note that CanvasWrapper doesn't show up and starts rendering automatically on instantiation. To start rendering and display the loader use the <code>show()</code> method.
 * @module CanvasWrapper
 **/
( function(window) {"use strict";
		/**
		 * CanvasWrapper is a JavaScript UI library that draws and animates circular preloaders using the Canvas HTML object.<br/><br/>
		 * A CanvasWrapper instance creates two canvas elements which are placed into a placeholder div (the id of the div has to be passed in the constructor). The second canvas is invisible and used for caching purposes only.<br/><br/>
		 * If no id is passed in the constructor, the canvas objects are paced in the document directly.
		 * @class CanvasWrapper
		 * @constructor
		 * @param id {String} The id of the placeholder div
		 * @param opt {Object} Optional parameters<br/><br/>
		 * <strong>Possible values of optional parameters:</strong><br/>
		 * <ul>
		 * <li><strong>id (String):</strong> The id of the CanvasWrapper instance</li>
		 * <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasWrapper shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
		 **/
		var CanvasWrapper = function(id, opt) {
			if( typeof (opt) == "undefined") {
				opt = {};
			}
			if(typeof (id) !== "undefined")
				this.init(id, opt);
		}, p = CanvasWrapper.prototype, engine, engines = ["canvas", "vml"], cRX = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, ie8 = navigator.appVersion.indexOf("MSIE") !== -1 && parseFloat(navigator.appVersion.split("MSIE")[1]) === 8 ? true : false, canSup = !!document.createElement('canvas').getContext; 
		
		
		
		/**
		 * Creates a new element with the tag and applies the passed properties on it
		 * @method addEl
		 * @protected
		 * @param tag {String} The tag to be created
		 * @param par {String} The DOM element the new element will be appended to
		 * @param opt {Object} Additional properties passed to the new DOM element
		 * @return {Object} The DOM element
		 */
		p.addEl = function(tag, par, opt) {
			var el = document.createElement(tag), n;
			for(n in opt) {
				el[n] = opt[n];
			}
			if( typeof (par) !== "undefined") {
				par.appendChild(el);
			}
			return el;
		};
		/**
		 * Initialization method
		 * @method init
		 * @protected
		 * @param id {String} The id of the placeholder div, where the loader will be nested into
		 * @param opt {Object} Optional parameters<br/><br/>
		 * <strong>Possible values of optional parameters:</strong><br/>
		 * <ul>
		 * <li><strong>id (String):</strong> The id of the CanvasWrapper instance</li>
		 * <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasWrapper shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
		 **/
		p.init = function(pId, opt) {
			/*
			 * Find the containing div by id
			 * If the container element cannot be found we use the document body itself
			 */
			try {
				// Look for the parent element
				if(document.getElementById(pId) !== undefined) {
					this.mum = document.getElementById(pId);
				} else {
					this.mum = document.body;
				}
			} catch (error) {
				this.mum = document.body;
			}
			// Creates the parent div of the loader instance
			opt.id = typeof (opt.id) !== "undefined" ? opt.id : "canvasLoader";
			this.cont = this.addEl("div", this.mum, {
				id : opt.id
			});
			if(canSup) {
				// For browsers with Canvas support...
				engine = engines[0];
				// Create the canvas element
				this.can = this.addEl("canvas", this.cont);
				this.con = this.can.getContext("2d");
				// Create the cache canvas element
				this.cCan = this.setCSS(this.addEl("canvas", this.cont), {
					display : "none"
				});
				this.cCon = this.cCan.getContext("2d");
			}
			// Set the RGB color object
			this.setColor(this.color);
			// Draws the shapes on the canvas
			this.draw();
			//Hides the preloader
			this.setCSS(this.cont, {
				display : "none"
			});
		};
		
		/**
		 * Transforms the cache canvas before drawing
		 * @method transCon
		 * @protected
		 * @param	c {Object} The canvas context to be transformed
		 * @param	x {Number} x translation
		 * @param	y {Number} y translation
		 * @param	r {Number} Rotation radians
		 */
		p.transCon = function(c, x, y, r) {
			c.save();
			c.translate(x, y);
			c.rotate(r);
			c.translate(-x, -y);
			c.beginPath();
		};
		
		/**
		 * Sets the css properties on the element
		 * @method setCSS
		 * @protected
		 * @param el {Object} The DOM element to be styled
		 * @param opt {Object} The style properties
		 * @return {Object} The DOM element
		 */
		p.setCSS = function(el, opt) {
			for(var n in opt) {
				el.style[n] = opt[n];
			}
			return el;
		};
		/**
		 * Sets the attributes on the element
		 * @method setAttr
		 * @protected
		 * @param el {Object} The DOM element to add the attributes to
		 * @param opt {Object} The attributes
		 * @return {Object} The DOM element
		 */
		p.setAttr = function(el, opt) {
			for(var n in opt) {
				el.setAttribute(n, opt[n]);
			}
			return el;
		};
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Property declarations
		/**
		 * The div we place the canvas object into
		 * @property cont
		 * @protected
		 * @type Object
		 **/
		p.cont = {};
		/**
		 * The div we draw the shapes into
		 * @property can
		 * @protected
		 * @type Object
		 **/
		p.can = {};
		/**
		 * The canvas context
		 * @property con
		 * @protected
		 * @type Object
		 **/
		p.con = {};
		/**
		 * The canvas we use for caching
		 * @property cCan
		 * @protected
		 * @type Object
		 **/
		p.cCan = {};
		/**
		 * The context of the cache canvas
		 * @property cCon
		 * @protected
		 * @type Object
		 **/
		p.cCon = {};
		
		/**
		 * The color of the loader shapes in RGB
		 * @property cRGB
		 * @protected
		 * @type Object
		 **/
		p.cRGB = {};
		/**
		 * The color of the loader shapes in HEX
		 * @property color
		 * @protected
		 * @type String
		 * @default "#000000"
		 **/
		p.color = "#000000";
		/**
		 * Sets hexadecimal color of the loader
		 * @method setColor
		 * @public
		 * @param color {String} The default value is '#000000'
		 **/
		p.setColor = function(color) {
			this.color = cRX.test(color) ? color : "#000000";
			this.cRGB = this.getRGB(this.color);
			this.redraw();
		};
		/**
		 * Returns the loader color in a hexadecimal form
		 * @method getColor
		 * @public
		 * @return {String}
		 **/
		p.getColor = function() {
			return this.color;
		};
		
		// End of Property declarations
		/////////////////////////////////////////////////////////////////////////////////////////////
		/**
		 * Return the RGB values of the passed color
		 * @method getRGB
		 * @protected
		 * @param color {String} The HEX color value to be converted to RGB
		 */
		p.getRGB = function(c) {
			c = c.charAt(0) === "#" ? c.substring(1, 7) : c;
			return {
				r : parseInt(c.substring(0, 2), 16),
				g : parseInt(c.substring(2, 4), 16),
				b : parseInt(c.substring(4, 6), 16)
			};
		};
		/**
		 * Draw the shapes on the canvas
		 * @method draw
		 * @protected
		 */
		p.draw = function() {			
		};
		/**
		 * Cleans the canvas
		 * @method clean
		 * @protected
		 */
		p.clean = function() {
			if(engine === engines[0]) {
				this.con.clearRect(0, 0, 1000, 1000);
			}
		};
		/**
		 * Redraws the canvas
		 * @method redraw
		 * @protected
		 */
		p.redraw = function() {
			this.clean();
			this.draw();
		};
		
		/**
		 * Shows the rendering of the loader animation
		 * @method show
		 * @public
		 */
		p.show = function() {			
			this.setCSS(this.cont, {
					display : "block"
				});
		};
		/**
		 * Stops the rendering of the loader animation and hides the loader
		 * @method hide
		 * @public
		 */
		p.hide = function() {			
			this.setCSS(this.cont, {
					display : "none"
				});
		};
		
		/**
		 * Removes the CanvasWrapper instance and all its references
		 * @method kill
		 * @public
		 */
		p.kill = function() {
			var c = this.cont;
			
			if(engine === engines[0]) {
				c.removeChild(this.can);
				c.removeChild(this.cCan);
			}
			var n;
			for(n in this) {
				delete this[n];
			}
		};
		window.CanvasWrapper = CanvasWrapper;
	}(window));
