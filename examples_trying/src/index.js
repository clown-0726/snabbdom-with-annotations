// window.onload = function () {

var snabbdom = window.snabbdom;

// Define patch fun and init the core pkgs
var patch = snabbdom.init([
    snabbdom_class.default,
    snabbdom_props.default,
    snabbdom_attributes.default,
    snabbdom_style.default,
    snabbdom_eventlisteners.default
]);

var h = snabbdom.h;

// ######################################################### Above is to initialize snabbdom #########################################################
// ######################################################### Above is to initialize snabbdom #########################################################
// ######################################################### Above is to initialize snabbdom #########################################################

var vnode = newVnodeGen(1);
var container = document.getElementById('container');

console.log(vnode);

patch(container, vnode)


var count = 1;

function newVnodeGen(count) {
    return h(
        'div#container.two.classes', {
            on: {
                click: function () {
                    console.log(456)
                }
            }
        },
        [
            h('span', {
                    style: {
                        fontWeight: 'normal',
                        fontStyle: 'italics',
                    },
                    on: {
                        click: function () {
                            console.log('I am span')
                        }
                    },
                    class: {
                        active: true
                    }
                },
                'Read UI Benchmark\'s notes for caveats and stipulations before drawing further conclusions.'),
            h('br'),
            ' Be care the usage of the word DRAW ' + count,
            h('a', {
                props: {
                    href: '/bar'
                }
            }, ' I\'ll take you places!'),
            h('br'),
            h('input', {
                attrs: {
                    required: true,
                    autofocus: true
                },
                props: {
                    name: 'username',
                    id: 'username',
                    type: 'text'
                }
            }),
            h('button', {
                props: {
                    id: 'cbtn',
                    type: 'button'
                },
                on: {
                    click: function () {
                        alert('I am clicking');
                    }
                }
            }, 'Click me'),
            h('br'),
            h('select', {
                props: {
                    id: 'cselect'
                },
                on: {
                    change: function () {
                        console.log('I am changing')
                    }
                }
            }, [
                h('option', {
                    props: {
                        value: '1'
                    }
                }, '1st one'),
                h('option', {
                    props: {
                        value: '2'
                    }
                }, '2ed one')
            ]),
        ]
    )
}



function switchNode() {
    var newVnode = newVnodeGen(count)
    console.log(newVnode);
    patch(vnode, newVnode)

    count++;
}
// }