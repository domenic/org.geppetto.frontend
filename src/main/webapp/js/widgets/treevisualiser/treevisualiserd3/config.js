/*******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2011, 2013 OpenWorm.
 * http://openworm.org
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the MIT License
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *      OpenWorm - http://openworm.org/people.html
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/

/**
 * Loads tree visualiser scripts
 *
 * @author Adrian Quintana (adrian.perez@ucl.ac.uk)
 */


/*
 * Libraries used by Tree Visualizer widget
 */

require.config({
	  paths: {
	    "d3": "widgets/treevisualiser/treevisualiserd3/vendor/d3.min"
	  }
	});

var reqs = [];
reqs.push("d3");

define("d3.global", ["d3"], function(_) {
	  d3 = _;
	});

require(reqs, function(d3) {
	window.d3 = d3;
	loadCss("js/widgets/treevisualiser/treevisualiserd3/TreeVisualiserD3.css");
	
});

//Load TreeVisualiserController and other classes using GEPPETTO
define(function(require) {
	return function(GEPPETTO) {
		require("widgets/treevisualiser/treevisualiserd3/controllers/TreeVisualiserControllerD3")(GEPPETTO);
		
		// Register Commands
		GEPPETTO.MenuManager.registerNewCommandProvider(["EntityNode",
		                                                 "AspectNode",
		                                                 "AspectSubTreeNode",
		                                                 "CompositeNode",
		                                                 "DynamicsSpecificationNode",
		                                                 "FunctionNode",
		                                                 "ParameterNode",
		                                                 "ParameterSpecificationNode",
		                                                 "VariableNode"],
		                                                 GEPPETTO.TreeVisualiserControllerD3.getCommands);
	};
});