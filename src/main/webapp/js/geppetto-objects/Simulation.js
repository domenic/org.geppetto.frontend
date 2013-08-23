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
 *     	OpenWorm - http://openworm.org/people.html
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
 * 
 * Class for the Simulation Object. Handles user's request to start, stop, pause, 
 * and/or load a simulation.
 * 
 * @constructor
 * 
 * @author matteo@openworm.org (Matteo Cantarelli)
 * @author giovanni@openworm.org (Giovanni Idili)
 * @author  Jesus R. Martinez (jesus@metacell.us)
 */
var Simulation = Simulation ||
{
	REVISION : '1'
};

Simulation.StatusEnum =
{
	INIT : 0,
	LOADED : 1,
	STARTED : 2,
	PAUSED : 3,
	STOPPED: 4
};

Simulation.status = Simulation.StatusEnum.INIT;

/**
 * Start the simulation.
 * 
 * @returns {String}
 */
Simulation.start = function()
{
	//Update the simulation controls visibility
	FE.updateStartEvent();
	
	GEPPETTO.Main.socket.send("start");
	Simulation.status = Simulation.StatusEnum.STARTED;
	Console.log('Sent: Simulation started');
	
	return "Simulation Started";
};

/**
 * Pauses the simulation
 * 
 * @returns {String}
 * 
 */
Simulation.pause = function()
{
	//Updates the simulation controls visibility
	FE.updatePauseEvent();
	
	GEPPETTO.Main.socket.send("pause");
	Simulation.status = Simulation.StatusEnum.PAUSED;
	Console.log('Sent: Simulation paused');
	
	return "Simulation Paused";
};

/**
 * Stops the simulation 
 * 
 * @returns {String}
 */
Simulation.stop = function()
{
	//Updates the simulation controls visibility
	FE.updateStopEvent();
	
	GEPPETTO.Main.socket.send("stop");
	Simulation.status = Simulation.StatusEnum.STOPPED;
	Console.log('Sent: Simulation stopped');
	
	return "Simulation Stopped";
};

/**
 * Loads a simulation from a URL.
 * 
 * @param simulationURL - URL of simulation file
 * @returns {String}
 */
Simulation.load = function(simulationURL)
{
	//Updates the simulation controls visibility
	FE.updateLoadEvent();
	
	var webGLStarted = GEPPETTO.init(FE.createContainer());
	//update ui based on success of webgl
	FE.update(webGLStarted);
	//Keep going with load of simulation only if webgl container was created
	if(webGLStarted){
		FE.activateLoader("show", "Loading Simulation");
		if (Simulation.status == Simulation.StatusEnum.INIT)
		{
			//we call it only the first time
			GEPPETTO.animate();
		}
		GEPPETTO.Main.socket.send("init_url$" + simulationURL);
		Console.log('Sent: Simulation loaded');
	}
	
	return "Simulation Loaded";
};

/**
 * Loads a simulation using the content's from the simulation file editor
 * 
 * @param simulation - Simulation to be loaded
 * @returns {String}
 */
Simulation.loadEditedSimulationFile = function(simulation)
{
	//Update the simulation controls visibility
	FE.updateLoadEvent();
	
	var webGLStarted = GEPPETTO.init(FE.createContainer());
	//update ui based on success of webgl
	FE.update(webGLStarted);
	//Keep going with load of simulation only if webgl container was created
	if(webGLStarted){
		FE.activateLoader("show", "Loading Simulation");
		if (Simulation.status == Simulation.StatusEnum.INIT)
		{
			//we call it only the first time
			GEPPETTO.animate();
		}
		GEPPETTO.Main.socket.send("init_sim$" + simulation);
		Console.log('Sent: Simulation loaded');
	}
	
	return "Simulation Loaded";
};

/**
 * Returns true or false, depending if simulations is loaded or not
 * @returns {Boolean}
 */
Simulation.isLoaded = function()
{
	if(Simulation.status != Simulation.StatusEnum.INIT){
		return true;
	}
	
	return false;
};

/**
 * Return status of simulation
 */
Simulation.getStatus = function()
{
	return Simulation.status;
};