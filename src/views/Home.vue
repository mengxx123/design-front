<template>
    <my-page title="首页">
        <div class="editor-box">
            <div class="editor-content-box">
                <div ref="parent" id="parent" class="parent"
                     @contextmenu="contextmenu($event)"
                    @click="parentClick($event)">
                    <div id="child" class="child"
                         v-for="elem in elems"
                         :style="elemStyle(elem)"
                         :class="elemClass(elem)"
                         @contextmenu="elemContextmenu($event, elem)"
                         @click.stop="elemClick($event, elem)"
                         @dblclick="doubleClick($event, elem)"
                         @mousedown="mouseDown($event, elem)"
                         @mousemove="mouseMove($event, elem)"
                         @mouseup="mouseUp($event, elem)">
                        <div class="mask"></div>
                        <input class="input" v-model="elem.text" v-if="elem.edit" @blur="blur($event, elem)">
                        <span :style="{'line-height': elem.height + 'px'}" v-if="elem.type === 'text' && !elem.edit">{{ elem.text }}</span>
                        <img class="img-content" :src="elem.image" v-if="elem.type === 'image'"/>
                    </div>
                    <!-- 辅助线 -->
                    <div class="lines" v-if="lineVisible">
                        <div class="line-box" :class="lineClass(line)" v-for="line in lines"
                            @mousedown="lineMouseDown($event, line)"
                             :style="lineStyle(line)">
                            <div class="line"></div>
                        </div>
                    </div>
                </div>
                <handler ref="handler" :data="handlerData" v-if="curElem" @change="onChange" />
            </div>
        </div>
        <div class="tool-box">
            <div v-if="curElem">
                <div class="form-item">
                    <ui-text-field class="input-x" v-model="curElem.x" label="X" type="number" />
                    <ui-text-field class="input-y" v-model="curElem.y" label="Y" type="number" />
                </div>
                <div class="form-item">
                    <ui-text-field v-model="curElem.width" label="宽" type="number" />
                </div>
                <div class="form-item">
                    <ui-text-field v-model="curElem.height" label="高" type="number" />
                </div>
                <div class="form-item">
                    <ui-text-field v-model="curElem.text" label="文本" type="number" />
                </div>
                <ui-raised-button label="删除" @click="remove" />
            </div>
            <br>
            <ui-raised-button label="添加文字" @click="addText" />
            <ui-raised-button label="添加图片" @click="addImage" />
            <div>menuX: {{ menuX }}</div>
            <div>lines.length: {{ lines.length }}</div>
        </div>
        <div class="context-menu" v-if="menuVisiable" :style="menuStyle" @click.stop="doNothing">
            <ui-menu>
                <ui-menu-item title="Maps"/>
                <ui-menu-item title="Books"/>
                <ui-menu-item title="清空"/>
                <ui-menu-item title="准线" rightIcon="keyboard_arrow_right">
                    <ui-menu-item title="显示准线" :leftIcon="lineVisible ? 'check' : ''"
                                  :inset="!lineVisible" @click="toggleLineVisible"></ui-menu-item>
                    <ui-divider />
                    <ui-menu-item title="添加垂直准线" inset @click="addVerticalLine" />
                    <ui-menu-item title="添加水平准线" inset @click="addHorizontalLine"/>
                    <ui-divider />
                    <ui-menu-item title="清除辅助线" inset @click="clearLine" />
                </ui-menu-item>
                <ui-menu-item title="粘贴"/>
            </ui-menu>
        </div>
        <div class="context-menu" v-if="itemMenuVisible" :style="itemMenuStyle" @click.stop="doNothing">
            <ui-menu>
                <ui-menu-item title="剪切"/>
                <ui-menu-item title="复制"/>
                <ui-menu-item title="粘贴"/>
                <ui-menu-item title="清空"/>
            </ui-menu>
        </div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                curElem: null,
                elems: [
                    {
                        type: 'text',
                        id: '1',
                        text: '123',
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100
                    },
                    {
                        type: 'text',
                        id: '2',
                        text: '456',
                        x: 0,
                        y: 100,
                        width: 200,
                        height: 100
                    },
                    {
                        id: '3',
                        type: 'image',
                        text: '456',
                        x: 100,
                        y: 0,
                        width: 100,
                        height: 100,
                        image: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png'
                    }
                ],
                handlerData: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                // context menu
                menuVisiable: false,
                menuX: 200,
                menuY: 100,
                // item context menu
                itemMenuVisible: false,
                itemMenuX: 200,
                itemMenuY: 200,
                // lines
                lineVisible: true,
                lines: [
//                    {
//                        type: 'horizontal',
//                        position: 50
//                    },
//                    {
//                        type: 'vertical',
//                        position: 200
//                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        },
        computed: {
            menuStyle() {
                return {
                    top: this.menuY + 'px',
                    left: this.menuX + 'px'
                }
            },
            itemMenuStyle() {
                return {
                    top: this.itemMenuY + 'px',
                    left: this.itemMenuX + 'px'
                }
            }
        },
        mounted() {
//            this.selectElem(this.elems[1])
//            let $parent = document.getElementById('parent')
//            let $child = document.getElementById('parent')
        },
        destroyed() {
        },
        methods: {
            toggleLineVisible() {
                this.lineVisible = !this.lineVisible
            },
            clearLine() {
                this.lines = []
            },
            lineStyle(line) {
                if (line.type === 'vertical') {
                    return {
                        left: line.position + 'px'
                    }
                } else {
                    return {
                        top: line.position + 'px'
                    }
                }
            },
            lineClass(line) {
                if (line.type === 'vertical') {
                    return ['line-vertical']
                } else {
                    return ['line-horizontal']
                }
            },
            selectElem(elem) {
                this.curElem = elem
                this.$nextTick(() => {
                    this.$refs.handler.setData({
                        x: this.curElem.x,
                        y: this.curElem.y,
                        width: this.curElem.width,
                        height: this.curElem.height
                    })
                })
//                this.handlerData.x = this.curElem.x
//                this.handlerData.y = this.curElem.y
//                this.handlerData.width = this.curElem.width
//                this.handlerData.height = this.curElem.height
            },
            onChange(data) {
                this.curElem.x = data.x
                this.curElem.y = data.y
                this.curElem.width = data.width
                this.curElem.height = data.height
            },
            elemStyle(elem) {
                return {
                    left: elem.x + 'px',
                    top: elem.y + 'px',
                    width: elem.width + 'px',
                    height: elem.height + 'px'
                }
            },
            elemClass(elem) {
                if (this.curElem && elem.id === this.curElem.id) {
                    return ['active']
                }
                return []
            },
            doubleClick(e, elem) {
//                Vue.set(elem, 'edit', true)
            },
            blur(e, elem) {
                elem.edit = false
            },
            parentClick(e) {
                e.stopPropagation()
                e.preventDefault()
                this.curElem = null
                console.log('点击空白')
            },
            elemClick(e, elem) {
                console.log('点击了元素' + elem.id)
            },
            mouseDown(e, elem) {
                this.isDown = true
                this.downX = e.pageX
                this.downY = e.pageY
                this.downElem = elem
                this.selectElem(elem)
                this.originX = elem.x
                this.originY = elem.y
            },
            mouseMove(e, elem) {
                if (this.isDown) {
//                    console.log('move')
//                    this.downElem.x = this.originX + (e.pageX - this.downX)
//                    this.downElem.y = this.originY + (e.pageY - this.downY)
                }
            },
            mouseUp(e, elem) {
                this.isDown = false
            },
            contextmenu(e) {
                console.log('菜单')
                this.menuVisiable = true
                this.menuX = e.pageX
                this.menuY = e.pageY
                e.returnValue = false
                document.addEventListener('click', this._docClick = e => {
                    document.removeEventListener('click', this._docClick)
                    this.menuVisiable = false
                })
                return false
            },
            elemContextmenu(e) {
                console.log('菜单')
                this.itemMenuVisible = true
                this.itemMenuX = e.pageX
                this.itemMenuY = e.pageY
                e.returnValue = false
                document.addEventListener('click', this._docClick = e => {
                    document.removeEventListener('click', this._docClick)
                    this.itemMenuVisible = false
                })
                return false
            },
            remove() {
                for (let i = 0; i < this.elems.length; i++) {
                    if (this.elems[i].id === this.curElem.id) {
                        this.elems.splice(i, 1)
                        return
                    }
                }
            },
            addText() {
                this.elems.push({
                    id: new Date().getTime(),
                    type: 'text',
                    text: '未命名',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                })
            },
            addImage() {
                this.elems.push({
                    id: new Date().getTime(),
                    type: 'image',
                    text: '456',
                    x: 100,
                    y: 100,
                    width: 100,
                    height: 100,
                    image: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png'
                })
            },
            doNothing() {},
            lineMouseDown(e, line) {
                console.log('下')
                console.log(e.pageX)
                let mouseMove
                let mouseUp
//                let isDown = true
                document.addEventListener('mousemove', mouseMove = e => {
                    if (line.type === 'vertical') {
                        line.position = e.pageX - this.$refs.parent.getBoundingClientRect().left
                        console.log(line.position)
                    } else {
                        line.position = e.pageY - this.$refs.parent.getBoundingClientRect().top
                    }
                    console.log('move')
                })
                document.addEventListener('mouseup', mouseUp = e => {
                    console.log('up')
                    document.removeEventListener('mousemove', mouseMove)
                    document.removeEventListener('mouseup', mouseUp)
                })
            },
            addVerticalLine() {
                this.lines.push({
                    type: 'vertical',
                    position: this.menuX - this.$refs.parent.getBoundingClientRect().left
                })
            },
            addHorizontalLine() {
                this.lines.push({
                    type: 'horizontal',
                    position: this.menuY - this.$refs.parent.getBoundingClientRect().top
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
