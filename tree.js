let childrenCount = {};
let highestId = 0;
let changedTree = [];

let typeTemplates = {
    "item": {
        "title": "item",
        "category": "item",
        "link": "https://www.youtube.com/watch?v=PYaixyrzDOk",
        "type": "item",
        "requires": [],
        "children": []
    },
    "skill": {
        "id": parseInt(highestId + 1),
        "iconName": "skill",
        "title": "challenge",
        "level": 1,
        "goal": "Edit the data",
        "frequency": "DAILY",
        "timelimit": "1x Week",
        "xp": 69,
        "category": "new",
        "type": "skill",
        "requires": [],
        "children": []
    },
    "challenge": {
        "title": "item",
        "category": "item",
        "timelimit": "1x Week",
        "type": "challenge",
        "requires": [],
        "children": []
    }
};

async function drawNode(data, parentId) {
    console.log(data)
    let node = document.createElement('li');
    let nodeAncor = document.createElement('a');
    let nodeTitle = document.createElement('span');
    nodeTitle.innerHTML = data.title;
    node.classList.add('node');
    node.id = `node-${data.id}`;

    nodeAncor.addEventListener('click', function () {
        showcaseData(findNode(changedTree, data.id));
    });

    nodeAncor.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        let newNode = {
            "id": parseInt(highestId + 1),
            "iconName": "edit",
            "title": "Editing I",
            "level": 1,
            "goal": "Edit the data",
            "frequency": "DAILY",
            "timelimit": "1x Week",
            "xp": 69,
            "category": "new",
            "type": "skill",
            "requires": [],
            "children": []
        };
        addNode(changedTree, parseInt(data.id), newNode);
        drawNode(newNode, data.id);

        return false;
    });

    nodeAncor.appendChild(nodeTitle);
    node.appendChild(nodeAncor);


    if (!parentId && parentId !== 0) {
        document.querySelector('.tree').appendChild(node);
        return;
    }

    let parentNode = document.getElementById(`node-${parentId}-ul`);

    if (!parentNode) {
        let ul = document.createElement('ul');
        ul.id = `node-${parentId}-ul`;
        document.getElementById(`node-${parentId}`).appendChild(ul);
    }

    // update highestId if the new node has a higher id than the current highestId
    if (data.id > highestId) {
        console.log(`${data.id} is larger than ${highestId}`);
        highestId = data.id;
    }

    document.getElementById(`node-${parentId}-ul`).appendChild(node);


}

function addNode(tree, parentId, newNodeData) {
    let parent = findNode(tree, parentId);
    if (parent) {
        if (!parent.children && parent.children != []) parent.children = [];
        parent.children.push(newNodeData.id);
        changedTree.push(newNodeData);
        window.localStorage.setItem('tree', JSON.stringify(changedTree));
    }
    else {
        console.log(`No parent found for ${parentId}`);
    }
}

function drawItem(data) {

}

function drawSkill(data) {

}

function drawChallenge(data) {

}

function drawChildren(list, parent) {
    if (!parent.children) return;
    parent.children.forEach(child => {
        let childData = findNode(list, child);
        console.log(child);
        drawNode(findNode(list, child), parent.id);
        if (childData) {
            console.log(`Drawing child ${childData.title}`);
            drawChildren(list, childData);
        }
    });
}

function init(data) {
    changedTree = data;
    console.log("initializing tree")
    let root = getRoot(data);
    if (root) {
        drawNode(root);
        drawChildren(data, root);
    }
    else {
        console.log('No root node found');
        return
    }

    // for(let i = 0; i <= root.children.length; i++) {
    //     drawNode(findNode(data, root.children[i]), root.id);
    // }
}

function getRoot(list) {
    let root = list.find(item => item.category == 'root');

    return root ? root : null;
}

function findNode(list, id) {
    let node = list.find(item => item.id == id);
    if (node) {
        return node;
    }
    return null;
}

function findNodeIndex(list, id) {
    let index = list.findIndex(item => item.id == id);
    if (index > -1) {
        return index;
    }
    return null;
}

function showcaseData(data) {
    // copy the data from the template to data-inputs
    let skillEditor = document.querySelector('#data-inputs');
    let templateData = document.querySelector(`#node-edit-template`);
    skillEditor.innerHTML = templateData.innerHTML;
    let editFields = skillEditor.querySelector('.edit-fields');
    // if (templateData) {
    //     skillEditor.innerHTML = templateData.innerHTML;
    //     // set the data-id attribute of the data-inputs to the id of the node
    //     skillEditor.setAttribute('data-id', data.id);
    //     console.log(data);
    //     // populate the input fields in the data-inputs with the data from the selected node
    //     let inputs = skillEditor.querySelectorAll('input');
    //     inputs.forEach(input => {
    //         input.value = data[input.name];
    //     });

    //     skillEditor.querySelector('#node-type').value = data.type;
    // }
    editFields.innerHTML = '';
    editFields.setAttribute('data-id', data.id);
    skillEditor.querySelector('#node-type').value = data.type;
    skillEditor.querySelector('#node-type').addEventListener('change', function () {
        console.log('new type')
        let type = skillEditor.querySelector('#node-type').value;
        editFields.innerHTML = '';
        let newData = typeTemplates[type];
        newData.children = data.children;
        newData.id = data.id;
        newData.requires = data.requires;
        showcaseData(newData);
    });
    for (let field in data) {
        if(field == 'type' || field == 'children') continue;
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', field);
        input.setAttribute('value', data[field]);
        input.setAttribute('placeholder', field);
        input.setAttribute('id', `node-${field}`);
        skillEditor.querySelector('.edit-fields').appendChild(input);
    }
}

function saveButtonClick() {
    let id = parseInt(document.querySelector('.edit-fields').getAttribute('data-id'));
    console.log(`Saving ${id}`);
    let data = findNode(changedTree, id);
    let newData = {};
    newData.id = data.id;
    let inputs = document.querySelectorAll('.edit-fields input');
    inputs.forEach(input => {
        newData[input.name] = input.value;
    });
    newData.type = document.querySelector('#node-type').value;

    // data.children = findNode(changedTree, data.id).children;
    updateNode(id, newData);
}

function updateNode(id, data) {
    let node = document.getElementById(`node-${id}`);
    if (node) {
        changedTree[findNodeIndex(changedTree, id)] = data;
        node.querySelector('span').innerHTML = data.title;
        window.localStorage.setItem('tree', JSON.stringify(changedTree));
    }
    else {
        console.log(`No node found for ${id}`);
    }
}

function displayJson() {
    let json = JSON.stringify(changedTree);
    document.querySelector('#json-output').innerHTML = json;
}

function loadJson() {
    document.querySelector('.tree').innerHTML = "";
    let json = document.querySelector('#json-input').value;
    let data = JSON.parse(json);
    init(data);
}

function loadLastSession() {
    let tree = window.localStorage.getItem('tree');
    document.querySelector('.tree').innerHTML = "";
    if (tree) {
        init(JSON.parse(tree));
    }
    else {
        console.log('No tree found');
    }
}

document.querySelector("#jsonInputModal").addEventListener('shown.bs.modal', () => {
    if (window.localStorage.getItem('tree')) {
        document.querySelector('.json-input_last-session-container').style.display = "block";
    }
})

document.querySelector("#editor-expand").addEventListener('click', () => {
    let editor = document.querySelector('#node-editor');
    editor.classList.add('expanded');
});

document.querySelector("#editor-close").addEventListener('click', () => {
    let editor = document.querySelector('#node-editor');
    editor.classList.remove('expanded');
});
