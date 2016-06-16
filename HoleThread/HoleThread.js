//Author-
//Description-

function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }
    
    var ui, product, design, rootComp;
    var app = adsk.core.Application.get();
    if (app) {
        ui = app.userInterface;
        product = app.activeProduct;
        design = adsk.fusion.Design(product);

        // Get the root component of the active design.
        rootComp = design.rootComponent;
    }
    
    // Create the command definition.
    var createCommandDefinition = function() {
        var commandDefinitions = ui.commandDefinitions;
        
        // Be fault tolerant in case the command is already added...
        var cmDef = commandDefinitions.itemById('HoleThread');
        if (!cmDef) {
            cmDef = commandDefinitions.addButtonDefinition('HoleThread', 
                    'Create Hole with Thread', 
                    'Create Hole with Thread.',
                    './resources'); // relative resource file path is specified
            var addInsPanel = ui.allToolbarPanels.itemById('SolidScriptsAddinsPanel');
            var buttonControl = addInsPanel.controls.addCommand(cmDef);
            buttonControl.isPromotedByDefault = true;
            buttonControl.isPromoted = true;
        }
        return cmDef;
    };
    
    var onCommandExecuted = function(args) {
        // Get command
        var command = args.command;
        var inputs = command.commandInputs;
        
        var input0 = inputs.item(0);
        var sel0 = input0.selection(0);
        
        var pt0 = sel0.point;
        var planeFace0 = sel0.entity;
        
        // Create a hole input
        var holes = rootComp.features.holeFeatures;
        var holeInput = holes.createSimpleInput(adsk.core.ValueInput.createByString('10 mm'));
        holeInput.setPositionByPoint(planeFace0, pt0);
        holeInput.setDistanceExtent(adsk.core.ValueInput.createByReal(1));
        
        var hole = holes.add(holeInput);
        
        // define all of the thread information.
        var threadFeatures = rootComp.features.threadFeatures;
        
        // querty the thread table to get the thread information
        var threadDataQuery = threadFeatures.threadDataQuery;
        var threadTypes = threadDataQuery.allThreadTypes;
        var threadType = threadTypes[10];
        // Declare the output arguments as objects.
        var designationObj = {};
        var threadClassObj = {};
        var returnValue = threadDataQuery.recommendThreadData(1.0, true, threadType, designationObj, threadClassObj);


        // Get the returned values from the objects.
        var designation = designationObj.value;
        var threadClass = threadClassObj.value;
        
        // create the threadInfo according to the query result
        var threadInfo = threadFeatures.createThreadInfo(true, threadType, designation, threadClass);
        
        // get the face the thread will be applied to
        var sideface = holes.item(0).sideFaces.item(0);
        var faces = adsk.core.ObjectCollection.create();
        faces.add(sideface);
        
        // define the thread input with the lenght 3.5 cm
        var threadInput = threadFeatures.createInput(faces, threadInfo);
        threadInput.isFullLength = true;
        //threadInput.threadLength = adsk.core.ValueInput.createByReal(3.5);
        
        // create the final thread
        var thread = threadFeatures.add(threadInput);
        
        //ui.messageBox('In Command Execute Event Handler');
    };
    
    var onCommandExecutedPreview = function(args) {
        // Get command
        var command = args.command;
        var inputs = command.commandInputs;
        
        var input0 = inputs.item(0);
        var sel0 = input0.selection(0);
        
        var pt0 = sel0.point;
        var planeFace0 = sel0.entity;
        
        // Create a hole input
        var holes = rootComp.features.holeFeatures;
        var holeInput = holes.createSimpleInput(adsk.core.ValueInput.createByString('10 mm'));
        holeInput.setPositionByPoint(planeFace0, pt0);
        holeInput.setDistanceExtent(adsk.core.ValueInput.createByReal(1));
        
        var hole = holes.add(holeInput);
        
        //ui.messageBox('Select Position: X: ' + pt0.x + ' Y: ' + pt0.y + ' Z: ' + pt0.z);
    };
    
    var onCommandCreated = function(args) {
        try
        {
            var command = args.command;
            command.isRepeatable = false;
            command.execute.add(onCommandExecuted);
            command.executePreview.add(onCommandExecutedPreview);
            //command.destroy.add(function () { adsk.terminate(); });
            
            var inputs = command.commandInputs;

            var i1 = inputs.addSelectionInput('entity', 'Entity One', 'Please select a plane');

            i1.addSelectionFilter(adsk.core.SelectionCommandInput.PlanarFaces);
        }
        catch (e) {
            ui.messageBox('Failed to create command : ' + (e.description ? e.description : e));
        }
    };
 
    try { 
        //ui.messageBox('Hello script');        
        var command = createCommandDefinition();
        var commandCreatedEvent = command.commandCreated;
        commandCreatedEvent.add(onCommandCreated);
        
        //add button to the menu after add hole
        //command.execute();
    } 
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }

    //adsk.terminate(); 
}

function stop(context) {
    var ui;
    var app = adsk.core.Application.get();
    if (app) {
        ui = app.userInterface;
    }
    try { 
        var addInsPanel = ui.allToolbarPanels.itemById('SolidScriptsAddinsPanel');
        var buttonControl = addInsPanel.controls.itemById('HoleThread');
        if (buttonControl) {
            buttonControl.deleteMe();
        }
        
        var existingDef = ui.commandDefinitions.itemById('HoleThread');
        if (existingDef) {
            existingDef.deleteMe();
        }
        
        adsk.terminate(); 
    } 
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }
}