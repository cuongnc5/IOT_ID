import {t} from '../util/locale';
import {behaviorDrawJsonWay} from '../behavior';


export function modeDrawJsonLine(context, wayId, startGraph, affix) {
    var mode = {
        button: 'load-line',
        id: 'load-line'
    };

    var behavior;


    mode.enter = function () {
        var way = context.entity(wayId);
        var index = (affix === 'prefix') ? 0 : undefined;
        var headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = behaviorDrawJsonWay(context, wayId, index, mode, startGraph)
            .tail(t('modes.draw_line.tail'));

        var addNode = behavior.addNode;
        behavior.addNode = function (node, d) {
            if (node.id === headId) {
                behavior.finish();
            } else {
                addNode(node, d);
            }
        };

        context.install(behavior);
    };


    mode.exit = function () {
        context.uninstall(behavior);
    };


    mode.selectedIDs = function () {
        return [wayId];
    };


    mode.activeID = function () {
        return (behavior && behavior.activeID()) || [];
    };

    mode.loadJsonLine = function (locs) {
        behavior.adds(locs, {})
        if (locs && locs.length > 1)
            context.map().centerZoom(locs[0], context.map().zoom())
    }

    return mode;
}
