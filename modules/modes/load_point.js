import {t} from '../util/locale';
import {actionAddEntity} from '../actions';
import {behaviorDraw} from '../behavior';
import {modeBrowse, modeSelect} from './index';
import {osmNode} from '../osm';


export function modeLoadPoint(context) {
    var mode = {
        id: 'load-point',
        button: 'load-point',
        title: 'Load points',
        description: 'Load points from json file',
        key: '7'
    };

    var behavior = behaviorDraw(context)
        .tail(t('modes.add_point.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);


    function adds(locs) {
        for (var i = 0; i < locs.length; i++)
            add(locs[i])
    }

    function add(loc) {
        var node = osmNode({loc: loc});

        context.perform(
            actionAddEntity(node),
            t('operations.add.annotation.point')
        );

        context.enter(
            modeSelect(context, [node.id]).newFeature(true)
        );
    }


    function addWay(loc) {
        add(loc);
    }


    function addNode(node) {
        add(node.loc);
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }

    function selectFile(event) {
        var file_input = document.createElement('input');
        file_input.addEventListener("change", function (fileInput) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var jfile = JSON.parse(e.target.result)
                if (jfile && jfile.length > 1) {
                    adds(jfile)
                }
            }
            reader.readAsText(fileInput.target.files[0]);


        }, false);
        file_input.type = 'file';
        file_input.setAttribute('accept', ".json")
        file_input.click();
    }

    mode.enter = function () {
        context.install(behavior);
        selectFile();
    };


    mode.exit = function () {
        context.uninstall(behavior);
    };


    return mode;
}
