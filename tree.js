let childrenCount = {};

const seperationPX = [25, 125];
let changedTree = [];

function drawNode(data, parentId) {
    let node = document.createElement('div');
    node.classList.add('node');
    node.id = `node-${data.id}`;
    node.innerHTML = `<p>${data.title}</p>`;

    // place the node in the correct spot under the parent using absolute positioning
    let parentNode = document.getElementById(`node-${parentId}`);

    if (parentNode) {
        childrenCount[parentId] = childrenCount[parentId] ? childrenCount[parentId] + 1 : 1;
        node.style.left = `${parentNode.offsetLeft + parentNode.offsetWidth + seperationPX[0]}px`;
        node.style.top = `${parentNode.offsetTop + seperationPX[1] * childrenCount[parentId]}px`;
    }
    

    node.addEventListener('click', function () {
        showcaseData(findNode(changedTree, data.id));
    });

    node.addEventListener('dblclick', function () {
        drawNode({ id: '99', title: 'New Node', category: 'root', children: [] }, data.id);
    }); 


    if (parentId) {
        node.classList.add(`parent-${parentId}`);
    }
    document.querySelector('#tree-container').appendChild(node);


}

function addNode(tree, parentId,newNodeData) {
    let parent = findNode(tree, parentId);
    if (parent) {
        parent.children.push(newNodeData.id);
        changedTree.push(newNodeData);
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
    parent.children.forEach(child => {
        let childData = findNode(list, child);
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
    // copy the data from the template to skill-editor
    let skillEditor = document.querySelector('#skill-inputs');
    let templateData = document.querySelector(`#${data.type}-edit-template`);

    if (templateData) {
        skillEditor.innerHTML = templateData.innerHTML;
        // set the data-id attribute of the skill-editor to the id of the node
        skillEditor.setAttribute('data-id', data.id);
        console.log(data);
        // populate the input fields in the skill-editor with the data from the selected node
        let inputs = skillEditor.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = data[input.name];
        });

        skillEditor.querySelector('#node-type').value = data.type;
    }
    else {
        console.log(`No template found for ${data.type}`);
    }
}

function saveButtonClick() {
    console.log("click")
    let id = document.querySelector('#skill-inputs').getAttribute('data-id');
    console.log(id);
    let data = {};
    let inputs = document.querySelectorAll('#skill-inputs input');
    data.id = id;
    inputs.forEach(input => {
        data[input.name] = input.value;
    });
    updateNode(id, data);
}

function updateNode(id, data) {
    let node = document.getElementById(`node-${id}`);
    if(node) {
        changedTree[findNodeIndex(changedTree, id)] = data;
        node.innerHTML = `<p>${data.title}</p>`;
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
    let json = document.querySelector('#json-input').value;
    let data = JSON.parse(json);
    init(data);
}