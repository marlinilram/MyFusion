function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }
 
    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;
        
        // Create a document.
        var doc = app.documents.add(adsk.core.DocumentTypes.FusionDesignDocumentType);
 
        var product = app.activeProduct;
        var design = adsk.fusion.Design(product);

        // Get the root component of the active design.
        var rootComp = design.rootComponent;
        
        // Create sketch
        var sketches = rootComp.sketches;
        var sketch = sketches.add(rootComp.xZConstructionPlane);
        var sketchCircles = sketch.sketchCurves.sketchCircles;
        var centerPoint = adsk.core.Point3D.create(0, 0, 0);
        var circle = sketchCircles.addByCenterRadius(centerPoint, 3.0);
        
        // Get the profile defined by the circle.
        var prof = sketch.profiles.item(0);

        // Create an extrusion input
        var extrudes = rootComp.features.extrudeFeatures;
        var extInput = extrudes.createInput(prof, adsk.fusion.FeatureOperations.NewBodyFeatureOperation);
        
        // Define that the extent is a distance extent of 5 cm.
        var distance = adsk.core.ValueInput.createByReal(5);
        extInput.setDistanceExtent(false, distance);

        // Create the extrusion.
        var ext = extrudes.add(extInput);
        
        // Get the end face of the extrusion
        var endFaces = ext.endFaces;
        var endFace = endFaces.item(0);
        
        // Create a construction plane by offsetting the end face
        var planes = rootComp.constructionPlanes;
        var planeInput = planes.createInput();
        var offsetVal = adsk.core.ValueInput.createByString('2 cm');
        planeInput.setByOffset(endFace, offsetVal);
        var offsetPlane = planes.add(planeInput);
        
        // Create a sketch on the new construction plane and add four sketch points on it
        var offsetSketch = sketches.add(offsetPlane);
        var offsetSketchPoints = offsetSketch.sketchPoints;
        var sPt0 = offsetSketchPoints.add(adsk.core.Point3D.create(1, 0, 0));
        var sPt1 = offsetSketchPoints.add(adsk.core.Point3D.create(0, 1, 0));
        var sPt2 = offsetSketchPoints.add(adsk.core.Point3D.create(-1, 0, 0));
        var sPt3 = offsetSketchPoints.add(adsk.core.Point3D.create(0, -1, 0));
        
        // Add the four sketch points into a collection
        var ptColl = adsk.core.ObjectCollection.create();
        ptColl.add(sPt0);
        ptColl.add(sPt1);
        ptColl.add(sPt2);
        ptColl.add(sPt3);
        
        // Create a hole input
        var holes = rootComp.features.holeFeatures;
        var holeInput = holes.createSimpleInput(adsk.core.ValueInput.createByString('10 mm'));
        holeInput.setPositionBySketchPoints(ptColl);
        holeInput.setDistanceExtent(distance);
        
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
    } 
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }

    adsk.terminate(); 
}