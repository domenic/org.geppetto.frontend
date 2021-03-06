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
 * Client class use to represent an Aspect. It stores that aspect's properties
 * along with its population, visualization and model tree.
 * 
 * @module nodes/AspectNode
 * @author Jesus R. Martinez (jesus@metacell.us)
 */
define(function(require) {

	var Node = require('nodes/Node');
	var AspectSubTreeNode = require('nodes/AspectSubTreeNode');
	var $ = require('jquery');

	return Node.Model
			.extend({
				relations : [ {
					type : Backbone.Many,
					key : 'children',
					relatedModel : AspectSubTreeNode,
				}, ],

				defaults : {
					children : []
				},
				modelInterpreterName : "",
				simulatorName : "",
				modelURL : "",
				selected : false,
				ModelTree : {},
				VisualizationTree : {},
				SimulationTree : {},
				parentEntity : null,
				_metaType : "AspectNode",
				/**
				 * Initializes this node with passed attributes
				 * 
				 * @param {Object} options - Object with options attributes to
				 *                           initialize node
				 */
				initialize : function(options) {
					this.id = options.id;
					this.modelInterpreterName = options.modelInterpreter;
					this.simulatorName = options.simulator;
					this.modelURL = options.model;
					this.instancePath = options.instancePath;
					this.name = options.name;
				},

				/**
				 * Hides the aspect
				 * 
				 * @command AspectNode.hide()
				 * 
				 */
				hide : function() {
					var message;
					if (GEPPETTO.hideAspect(this.instancePath)) {
						message = GEPPETTO.Resources.HIDE_ASPECT
								+ this.instancePath;
					} else {
						message = GEPPETTO.Resources.ASPECT_ALREADY_HIDDING;
					}
					this.visible = false;
					return message;
				},

				/**
				 * Shows the aspect
				 * 
				 * @command AspectNode.show()
				 * 
				 */
				show : function() {
					var message;
					if (GEPPETTO.showAspect(this.instancePath)) {
						message = GEPPETTO.Resources.SHOW_ASPECT
								+ this.instancePath;
					} else {
						message = GEPPETTO.Resources.ASPECT_ALREADY_VISIBLE;
					}
					this.visible = true;
					return message;
				},
				/**
				 * Unselects the aspect
				 * 
				 * @command AspectNode.unselect()
				 * 
				 */
				unselect : function() {
					var message;
					if (GEPPETTO.unselectAspect(this.instancePath)) {
						message = GEPPETTO.Resources.UNSELECTING_ASPECT
								+ this.instancePath;
						this.selected = false;
						this.parentEntity.selected = false;
						GEPPETTO.WidgetsListener
								.update(GEPPETTO.WidgetsListener.WIDGET_EVENT_TYPE.SELECTION_CHANGED);
					} else {
						message = GEPPETTO.Resources.ASPECT_NOT_SELECTED;
					}
					return message;
				},
				/**
				 * Selects the aspect
				 * 
				 * @command AspectNode.unselect()
				 * 
				 */
				select : function() {
					var message;
					if (GEPPETTO.selectAspect(this.instancePath)) {
						message = GEPPETTO.Resources.SELECTING_ASPECT
								+ this.instancePath;
						this.selected = true;
						this.parentEntity.selected = true;

						GEPPETTO.WidgetsListener
								.update(GEPPETTO.WidgetsListener.WIDGET_EVENT_TYPE.SELECTION_CHANGED);
					} else {
						message = GEPPETTO.Resources.ASPECT_ALREADY_SELECTED;
					}

					return message;
				},

				/**
				 * Get the model interpreter associated with aspect
				 * 
				 * @command AspectNode.getId()
				 */
				getId : function() {
					return this.id;
				},

				/**
				 * Get this entity's children entities
				 * 
				 * @command EntityNode.getChildren()
				 * 
				 * @returns {List<Aspect>} All children e.g. aspects and
				 *          entities
				 * 
				 */
				getChildren : function() {
					var subtrees = this.get("children");

					return subtrees;
				},

				/**
				 * Get the model interpreter associated with aspect
				 * 
				 * @command AspectNode.getModelInterpreterName()
				 */
				getModelInterpreterName : function() {
					return this.modelInterpreterName;
				},

				/**
				 * Get the simulator interpreter associated with aspect
				 * 
				 * @command AspectNode.getSimulatorName()
				 */
				getSimulatorName : function() {
					return this.simulatorName;
				},

				/**
				 * Get model URL associated with the aspect
				 * 
				 * @command AspectNode.getModelURL()
				 */
				getModelURL : function() {
					return this.modelURL;
				},

				/**
				 * Get formatted model tree for this aspect
				 * 
				 * @command AspectNode.getModelTree()
				 */
				getModelTree : function() {
					// empty model tree, request server for it
					if (this.ModelTree.getChildren().length == 0) {
						GEPPETTO.MessageSocket.send("get_model_tree",
								this.instancePath);

						return GEPPETTO.Resources.RETRIEVING_MODEL_TREE;
					}
					// model tree isn't empty, was requested previously and
					// stored
					else {
						return this.ModelTree;
					}
				},

				/**
				 * Get formatted simulation watch tree for this aspect.
				 * 
				 * @command AspectNode.getSimulationTree()
				 */
				getSimulationTree : function() {
					return this.SimulationTree;
				},

				/**
				 * Get formatted visualization watch tree for this aspect.
				 * 
				 * @command AspectNode.getVisualizationTree()
				 */
				getVisualizationTree : function() {
					return this.VisualizationTree;
				},

				getParentEntity : function() {
					return this.parentEntity;
				},

				setParentEntity : function(e) {
					this.parentEntity = e;
				},

				/**
				 * Print out formatted node
				 */
				print : function() {
					var formattedNode = "Name : " + this.name + "\n"
							+ "      Id: " + this.id + "\n"
							+ "      InstancePath : " + this.instancePath
							+ "\n" + "      SubTree : ModelTree \n"
							+ "      SubTree : VisualizationTree \n"
							+ "      SubTree : SimulationTree \n";

					return formattedNode;
				},
				getChildren : function(){
					 var children = new Backbone.Collection();
					 children.add(this.ModelTree);
					 children.add(this.SimulationTree);
					 children.add(this.VisualizationTree);
					 return children; 
				 }
			});
});
