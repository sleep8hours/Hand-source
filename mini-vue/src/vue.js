class Vue {
    constructor(options) {
        let { el } = options
        this.$el = document.querySelector(options.el)
        this.$data = options.data || {}
        this.$methods = options.methods || {}

        Object.keys(options.data).forEach(el =>{
            Object.defineProperty(this,el,{
                configurable:true,
                enumerable:true,
                get(){
                    return options.data[el]
                },
                set(v) {
                    console.log('options.data[el]',options.data[el])
                    options.data[el] = v
                }
            })
        })
        // 代理 methods
        Object.keys(options.methods).forEach(el =>{
            this[el] = options.methods[el]
        })

        new Compiler(this.$el,this)
    }

}

class Compiler {
    constructor(node,vm) {
        this.vm = vm
        this.compile(node)

    }
    compile(node){
        //  Array.from 转成真正的数组
        Array.from(node.childNodes).forEach((el)=>{
            // 文本节点显示
            if(el.nodeType == 3){
                const reg = /\{\{(.+?)\}\}/
                let value = el.textContent
                if(reg.test(value)){
                    const key = RegExp.$1.trim()
                    el.textContent = value.replace(reg, this.vm[key])
                }
            }
            // 解绑属性
            if(el.nodeType == 1){
                Array.from(el.attributes).forEach((attr)=>{
                    if(/^@/.test(attr.name)){
                        let ev = attr.name.replace(/@/,'')
                        // 绑定事件
                        el.addEventListener(ev,( e )=>{
                            this.vm[attr.value](e)
                        })
                    }
                })
            }


        })
    }
}


export default Vue;
