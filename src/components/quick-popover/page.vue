<template>
    <div>
        <div ref="button" @click="toggle">
            <slot name="element"></slot>
        </div>
        <ui-popover :trigger="trigger" :open="open" @close="handleClose">
            <slot name="popover"></slot>
        </ui-popover>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                open: false,
                trigger: null
            }
        },
        props: {
        },
        mounted () {
            this.trigger = this.$refs.button.$el
        },
        methods: {
            toggle() {
                this.open = !this.open
            },
            handleClose(e) {
                this.open = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui-page {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .page-body {
        min-height: 500px;
    }
    .container-main {
        padding-top: 16px;
    }
    .page-content {
        position: absolute;
        top: 0;
        left: 256px;
        right: 0;
        bottom: 0;
    }
    .page-container {
        padding: 16px;
    }
    .admin-container {
        padding: 16px;
    }
</style>
