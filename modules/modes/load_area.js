import { t } from '../util/locale';
import {
    actionAddEntity,
    actionAddMidpoint,
    actionAddVertex
} from '../actions';

import { behaviorAddWay } from '../behavior';
import { modeDrawArea } from './index';
import { osmNode, osmWay } from '../osm';
import {modeLoadDrawArea} from "./load_draw_area";


export function modeLoadArea(context) {
    var mode = {
        id: 'load-area',
        button: 'load-area',
        title:'Load area',
        description:'Load area from json file',
        key: '5'
    };

    var behavior = behaviorAddWay(context)
            .tail(t('modes.add_area.tail'))
            .on('start', start)
            .on('startFromWay', startFromWay)
            .on('startFromNode', startFromNode),
        defaultTags = { area: 'yes' };


    function actionClose(wayId) {
        return function (graph) {
            return graph.replace(graph.entity(wayId).close());
        };
    }


    function start(locs) {
        var startGraph = context.graph(),
            node = osmNode({ loc: locs[0] }),
            way = osmWay({ tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id)
        );
         var mode =modeLoadDrawArea(context, way.id, startGraph);
        context.enter(mode);
        mode.loadJsonArea(locs);
    }


    function startFromWay(loc, edge) {
        var startGraph = context.graph(),
            node = osmNode({ loc: loc }),
            way = osmWay({ tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id),
            actionAddMidpoint({ loc: loc, edge: edge }, node)
        );

        context.enter(modeDrawArea(context, way.id, startGraph));
    }


    function startFromNode(node) {
        var startGraph = context.graph(),
            way = osmWay({ tags: defaultTags });

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

    mode.enter = function() {
        selectFile();
        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };


    return mode;
}
