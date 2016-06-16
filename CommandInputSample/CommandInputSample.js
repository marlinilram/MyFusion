//Author-Autodesk Inc.
//Description-Demo command input examples
function run(context) {

    "use strict";
    var commandId = 'CommandInputGallery';
    var commandName = 'Command Input Gallery';
    var commandDescription = 'Demo command input examples.';
    
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }
    
    var app, ui;
    
    var onCommandCreated = function(args) {
        try {
            var command = args.command;

            // Terminate the script when the command is destroyed
            command.destroy.add(function () { adsk.terminate(); });
            
            var inputs = command.commandInputs;

            // Create tab input 1
            var tabCmdInput1 = inputs.addTabCommandInput(commandId + '_tab_1', 'Tab 1');
            var tab1ChildInputs = tabCmdInput1.children;
            
            // Create readonly textbox input
            tab1ChildInputs.addTextBoxCommandInput(commandId + '_textBox', 'Text Box', 'This is an example of Text Box. It is readonly.', 2, true);
            // Create editable textbox input
            tab1ChildInputs.addTextBoxCommandInput(commandId + '_textBox', 'Text Box2', 'This is an example of Text Box. It is not readonly.', 2, false);
            // Create selection input
            var selectionInput = tab1ChildInputs.addSelectionInput(commandId + '_selection', 'Select', 'Basic select command input');
            selectionInput.setSelectionLimits(0);
            // Create string value input
            tab1ChildInputs.addStringValueInput(commandId + '_string', 'Text', 'Basic string command input');
            // Create value input
            tab1ChildInputs.addValueInput(commandId + '_value', 'Value', 'cm', adsk.core.ValueInput.createByReal(0.0));
            // Create bool value input with checkbox style
            tab1ChildInputs.addBoolValueInput(commandId + '_checkbox', 'Checkbox', true, '', false);
            // Create bool value input with button style
            tab1ChildInputs.addBoolValueInput(commandId + '_button', 'Button', true, 'resources', false);
            // Create float slider input with two sliders
            tab1ChildInputs.addFloatSliderCommandInput(commandId + '_floatSlider', 'Float Slider', 'cm', 0, 10.0, true);
            // Create float slider input with two sliders and a value list
            var floatValueList = [1.0, 3.0, 4.0, 7.0];
            tab1ChildInputs.addFloatSliderListCommandInput(commandId + '_floatSlider2', 'Float Slider 2', 'cm', floatValueList);
            // Create float slider input with two sliders and visible texts
            var floatSlider3 = tab1ChildInputs.addFloatSliderCommandInput(commandId + '_floatSlider3', 'Float Slider 3', '', 0, 50.0, false);
            floatSlider3.setText('Min', 'Max');
            // Create integer slider input with one slider
            tab1ChildInputs.addIntegerSliderCommandInput(commandId + '_intSlider', 'Integer Slider', 0, 10);
            var valueList = [1, 3, 4, 7, 11];
            // Create integer slider input with two sliders and a value list
            tab1ChildInputs.addIntegerSliderListCommandInput(commandId + '_intSlider2', 'Integer Slider 2', valueList);
            // Create float spinner input
            tab1ChildInputs.addFloatSpinnerCommandInput(commandId + '_spinnerFloat', 'Float Spinner', 'cm', 0.2 , 9.0 , 2.2, 1);
            // Create integer spinner input
            tab1ChildInputs.addIntegerSpinnerCommandInput(commandId + '_spinnerInt', 'Integer Spinner', 2 , 9 , 2, 3);
            // Create dropdown input with checkbox style
            var dropdownInput = tab1ChildInputs.addDropDownCommandInput(commandId + '_dropdown', 'Dropdown', adsk.core.DropDownStyles.CheckBoxDropDownStyle);
            var dropdownItems = dropdownInput.listItems;
            dropdownItems.add('Item 1', false, 'resources');
            dropdownItems.add('Item 2', false, 'resources');
            // Create dropdown input with icon style
            var dropdownInput2 = tab1ChildInputs.addDropDownCommandInput(commandId + '_dropdown2', 'Dropdown2', adsk.core.DropDownStyles.LabeledIconDropDownStyle);
            var dropdown2Items = dropdownInput2.listItems;
            dropdown2Items.add('Item 1', true, 'resources');
            dropdown2Items.add('Item 2', false, 'resources');
            // Create dropdown input with radio style
            var dropdownInput3 = tab1ChildInputs.addDropDownCommandInput(commandId + '_dropdown3', 'Dropdown3', adsk.core.DropDownStyles.LabeledIconDropDownStyle);
            var dropdown3Items = dropdownInput3.listItems;
            dropdown3Items.add('Item 1', true, '');
            dropdown3Items.add('Item 2', false, '');
            // Create dropdown input with test list style
            var dropdownInput4 = tab1ChildInputs.addDropDownCommandInput(commandId + '_dropdown4', 'Dropdown4', adsk.core.DropDownStyles.TextListDropDownStyle);
            var dropdown4Items = dropdownInput4.listItems;
            dropdown4Items.add('Item 1', true, '');
            dropdown4Items.add('Item 2', false, '');
            // Create single selectable button row input
            var buttonRowInput = tab1ChildInputs.addButtonRowCommandInput(commandId + '_buttonRow', 'Button Row', false);
            buttonRowInput.listItems.add('Item 1', false, 'resources');
            buttonRowInput.listItems.add('Item 2', false, 'resources');
            // Create multi selectable button row input
            var buttonRowInput2 = tab1ChildInputs.addButtonRowCommandInput(commandId + '_buttonRow2', 'Button Row 2', true);
            buttonRowInput2.listItems.add('Item 1', false, 'resources');
            buttonRowInput2.listItems.add('Item 2', false, 'resources');

            // Create tab input 2
            var tabCmdInput2 = inputs.addTabCommandInput(commandId + '_tab_2', 'Tab 2');
            var tab2ChildInputs = tabCmdInput2.children;

            // Create group input
            var groupCmdInput = tab2ChildInputs.addGroupCommandInput(commandId + '_group', 'Group');
            groupCmdInput.isExpanded = true;
            groupCmdInput.isEnabledCheckBoxDisplayed = true;
            var groupChildInputs = groupCmdInput.children;
            
			// Create radio button group input
            var radioButtonGroup = groupChildInputs.addRadioButtonGroupCommandInput(commandId + '_radioButtonGroup', 'Radio button group');
            var radioButtonItems = radioButtonGroup.listItems;
            radioButtonItems.add("Item 1", false);
            radioButtonItems.add("Item 2", false);
            radioButtonItems.add("Item 3", false);
            
            // Create image input
            groupChildInputs.addImageCommandInput(commandId + "_image", "Image", "resources/image.png");
            
            // Create direction input 1
            var directionCmdInput = tab2ChildInputs.addDirectionCommandInput(commandId + '_direction', 'Direction');
            directionCmdInput.setManipulator(adsk.core.Point3D.create(0, 0, 0), adsk.core.Vector3D.create(1, 0, 0));
            
            // Create direction input 2
            var directionCmdInput2 = tab2ChildInputs.addDirectionCommandInput(commandId + '_direction2', 'Direction 2', 'resources');
            directionCmdInput2.setManipulator(adsk.core.Point3D.create(0, 0, 0), adsk.core.Vector3D.create(0, 1, 0)); 
            directionCmdInput2.isDirectionFlipped = true;
            
            // Create distance value input 1
            var distanceValueInput = tab2ChildInputs.addDistanceValueCommandInput(commandId + '_distanceValue', 'DistanceValue', adsk.core.ValueInput.createByReal(2));
            distanceValueInput.setManipulator(adsk.core.Point3D.create(0, 0, 0), adsk.core.Vector3D.create(1, 0, 0));
            distanceValueInput.minimumValue = 0;
            distanceValueInput.isMinimumValueInclusive = true;
            distanceValueInput.maximumValue = 10;
            distanceValueInput.isMaximumValueInclusive = true;
            
            // Create distance value input 2
            var distanceValueInput2 = tab2ChildInputs.addDistanceValueCommandInput(commandId + '_distanceValue2', 'DistanceValue 2', adsk.core.ValueInput.createByReal(1));
            distanceValueInput2.setManipulator(adsk.core.Point3D.create(0, 0, 0), adsk.core.Vector3D.create(0, 1, 0));
            distanceValueInput2.expression = '1 in';
            distanceValueInput2.hasMinimumValue = false;
            distanceValueInput2.hasMaximumValue = false;
        } catch (e) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    };
 
    try {
        app = adsk.core.Application.get();
        ui = app.userInterface;
        
        // Create command defintion
        var cmdDef = ui.commandDefinitions.itemById(commandId);
        if (!cmdDef) {
            cmdDef = ui.commandDefinitions.addButtonDefinition(commandId, commandName, commandDescription);
        }
            
        // Add command created event
        cmdDef.commandCreated.add(onCommandCreated);
        
        // Execute command
        cmdDef.execute();
    } 
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }

    adsk.terminate(); 
}