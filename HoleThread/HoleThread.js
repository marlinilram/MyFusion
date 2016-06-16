//Author-
//Description-

function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }
    
    var ui;
    var app = adsk.core.Application.get();
    if (app) {
        ui = app.userInterface;
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
        ui.messageBox('In Command Execute Event Handler');
    }
    
    var onCommandCreated = function(args) {
        try
        {
            var command = args.command;
            command.isRepeatable = false;
            command.execute.add(onCommandExecuted);
            command.executePreview.add(onCommandExecuted);
            command.destroy.add(function () { adsk.terminate(); });
        }
        catch (e) {
            ui.messageBox('Failed to create command : ' + (e.description ? e.description : e));
        }
    }
 
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