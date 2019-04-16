import {t} from '../util/locale';
import {
    actionAddEntity,
    actionAddMidpoint,
    actionAddVertex
} from '../actions';

import {behaviorAddWay} from '../behavior';
import {modeDrawArea} from './index';
import {osmNode, osmWay} from '../osm';
import {modeLoadDrawArea} from "./load_draw_area";


export function modeLoadMultiArea(context) {
    var mode = {
        id: 'load-mul-area',
        button: 'load-mul-area',
        title: 'Load multi area',
        description: 'Load multi area from json file',
        key: '7'
    };

    var behavior = behaviorAddWay(context)
            .tail(t('modes.add_area.tail'))
            .on('start', start)
            .on('startFromWay', startFromWay)
            .on('startFromNode', startFromNode),
        defaultTags = {area: 'yes'};


    function actionClose(wayId) {
        return function (graph) {
            return graph.replace(graph.entity(wayId).close());
        };
    }


    function start(jsonFile) {
        var location = jsonFile.location;
        var tags = {landuse: jsonFile.type, name: jsonFile.id, area: 'yes'}
        var startGraph = context.graph(),
            node = osmNode({loc: location[0]}),
            way = osmWay({tags: tags});

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id)
        );
        var mode = modeLoadDrawArea(context, way.id, startGraph);
        context.enter(mode);
        mode.loadJsonAreaNotJump(location);
    }


    function startFromWay(loc, edge) {
        var startGraph = context.graph(),
            node = osmNode({loc: loc}),
            way = osmWay({tags: defaultTags});

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id),
            actionAddMidpoint({loc: loc, edge: edge}, node)
        );

        context.enter(modeDrawArea(context, way.id, startGraph));
    }


    function startFromNode(node) {
        var startGraph = context.graph(),
            way = osmWay({tags: defaultTags});

        context.perform(
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id)
        );

        context.enter(modeDrawArea(context, way.id, startGraph));
    }

    function selectFile(event) {
        var file_input = document.createElement('input');
        file_input.addEventListener("change", function (fileInput) {

            var files = fileInput.target.files || []
            var i = 0;

            function readJson() {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var jfile = JSON.parse(e.target.result)
                    if (jfile && jfile.location && jfile.location.length > 1) {
                        start(jfile)
                    }
                    console.log(jfile.id)
                    // console.log(new Date(), json)
                    i++;
                    if (i < files.length)
                        readJson()
                    else {
                        context.map().centerZoom(jfile.location[0], context.map().zoom())

                        alert("Hoàn Thành")
                    }
                }
                reader.readAsText(files[i]);
            }

            readJson()

        }, false);
        file_input.type = 'file';

        file_input.setAttribute('accept', ".json")
        file_input.setAttribute('multiple', "multiple")
        file_input.click();
    }

    mode.enter = function () {
        selectFile();
        context.install(behavior);
    };


    mode.exit = function () {
        context.uninstall(behavior);
    };


    return mode;
}
