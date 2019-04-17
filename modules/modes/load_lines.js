import {t} from '../util/locale';
import {
    actionAddEntity,
    actionAddMidpoint,
    actionAddVertex
} from '../actions';

import {behaviorAddWay} from '../behavior';
import {modeDrawJsonLine} from './index';
import {osmNode, osmWay} from '../osm';


export function modeLoadLine(context) {
    var mode = {
        id: 'load-line',
        button: 'vertex',
        title: 'Load Line',
        description: 'Load Line',
        key: '6'
    };

    var behavior = behaviorAddWay(context)
        .tail(t('modes.add_line.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);


    function start(locs) {
        var startGraph = context.graph(),
            node = osmNode({loc: locs[0]}),
            way = osmWay();

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id)
        );
        var mode = modeDrawJsonLine(context, way.id, startGraph);
        context.enter(mode);
        mode.loadJsonLine(locs);
    }


    function startFromWay(loc, edge) {
        var startGraph = context.graph(),
            node = osmNode({loc: loc}),
            way = osmWay();

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionAddMidpoint({loc: loc, edge: edge}, node)
        );

        context.enter(modeDrawJsonLine(context, way.id, startGraph));
    }


    function startFromNode(node) {
        var startGraph = context.graph(),
            way = osmWay();

        context.perform(
            actionAddEntity(way),
            actionAddVertex(way.id, node.id)
        );

        context.enter(modeDrawJsonLine(context, way.id, startGraph));
    }

    function selectFile(event) {
        var file_input = document.createElement('input');
        file_input.addEventListener("change", function (fileInput) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var jfile = JSON.parse(e.target.result)
                if (jfile && jfile.length > 1) {
                    start(jfile)
                }
            }
            reader.readAsText(fileInput.target.files[0]);


        }, false);
        file_input.type = 'file';
        file_input.setAttribute('accept', ".json")
        file_input.click();
    }

    mode.enter = function () {
        selectFile()
        context.install(behavior);
    };


    mode.exit = function () {
        context.uninstall(behavior);
    };

    return mode;
}
