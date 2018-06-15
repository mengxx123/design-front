<template>
    <my-page title="首页">
        <div class="editor-box">
            <div class="editor-content-box">
                <div id="parent" class="parent"
                     @contextmenu="contextmenu($event)"
                    @click="parentClick($event)">
                    <div id="child" class="child"
                         v-for="elem in elems"
                         :style="elemStyle(elem)"
                         :class="elemClass(elem)"
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
        </div>
        <ui-menu class="context-menu" v-if="false">
            <ui-menu-item title="Maps"/>
            <ui-menu-item title="Books"/>
            <ui-menu-item title="Flights"/>
            <ui-menu-item title="Apps"/>
        </ui-menu>
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
        },
        mounted() {
            this.selectElem(this.elems[1])
//            let $parent = document.getElementById('parent')
//            let $child = document.getElementById('parent')
        },
        methods: {
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
                e.returnValue = false
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
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
