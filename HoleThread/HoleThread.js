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
        
        var input1 = inputs.item(1);
        
        var input2 = inputs.item(2);
        
        // Create a hole input
        var holes = rootComp.features.holeFeatures;
        var holeInput = holes.createSimpleInput(adsk.core.ValueInput.createByReal(2 * input1.value));
        holeInput.setPositionByPoint(planeFace0, pt0);
        holeInput.setDistanceExtent(adsk.core.ValueInput.createByReal(input2.value));
        
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
        var returnValue = threadDataQuery.recommendThreadData(2 * input1.value, true, threadType, designationObj, threadClassObj);


        // Get the returned values from the objects.
        var designation = designationObj.value;
        var threadClass = threadClassObj.value;
        
        // create the threadInfo according to the query result
        var threadInfo = threadFeatures.createThreadInfo(true, threadType, designation, threadClass);
        
        // get the face the thread will be applied to
        // the newest hole feature
        var sideface = holes.item(holes.count - 1).sideFaces.item(0);
        var faces = adsk.core.ObjectCollection.create();
        faces.add(sideface);
        
        // define the thread input with the lenght 3.5 cm
        var threadInput = threadFeatures.createInput(faces, threadInfo);
        //threadInput.isFullLength = true;
        threadInput.threadLength = adsk.core.ValueInput.createByReal(input2.value);
        
        // create the final thread
        var thread = threadFeatures.add(threadInput);
        
        //ui.messageBox('In Command Execute Event Handler');
    };
    
    var onInputChanged = function(args) {
        // Get command
        //var command = args.command;
        var inputs = args.inputs;
        var input0 = inputs.item(0);
        var input1 = inputs.item(1);
        
        if (input0.selectionCount != 0) {
            var sel0 = input0.selection(0);
        
            var pt0 = sel0.point;
            var planeFace0 = sel0.entity;
            var endPt = planeFace0.pointOnFace;
            var dir = adsk.core.Vector3D.create(endPt.x - pt0.x, endPt.y - pt0.y, endPt.z - pt0.z);
            dir.normalize();
            
            input1.setManipulator(pt0, dir);
            input1.isVisible = true;
        
            //ui.messageBox('test X: ' + dir.x + ' Y: ' + dir.y + ' Z: ' + dir.z);
        }
        else {
            input1.isVisible = false;
        }
        
    };
    
    var onCommandExecutedPreview = function(args) {
        // Get command
        var command = args.command;
        var inputs = command.commandInputs;
        
        var input0 = inputs.item(0);
        var sel0 = input0.selection(0);
        
        var pt0 = sel0.point;
        var planeFace0 = sel0.entity;
        
        var input1 = inputs.item(1);     
        
        var input2 = inputs.item(2);
        
        // Create a hole input
        var holes = rootComp.features.holeFeatures;
        var holeInput = holes.createSimpleInput(adsk.core.ValueInput.createByReal(2 * input1.value));
        holeInput.setPositionByPoint(planeFace0, pt0);
        holeInput.setDistanceExtent(adsk.core.ValueInput.createByReal(input2.value));
        
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
            command.inputChanged.add(onInputChanged);
            //command.destroy.add(function () { adsk.terminate(); });
            
            var inputs = command.commandInputs;

            // select base face for hole
            var i1 = inputs.addSelectionInput('HoleThread_selectEntity', 'Entity One', 'Please select a plane');
            i1.addSelectionFilter(adsk.core.SelectionCommandInput.PlanarFaces);
            
            // control radius of hole
            var i2 = inputs.addDistanceValueCommandInput('HoleThread_radiusControl', 'Radius', adsk.core.ValueInput.createByReal(0.5));
            i2.isEnabled = true;
            i2.isVisible = false;
            
            // control depth of hole
            var i3 = inputs.addFloatSpinnerCommandInput('HoleThread_depthControl', 'Depth', 'mm', 0.1, 100.0, 0.1, 1.0);
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