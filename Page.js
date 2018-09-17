const fs = require('fs');
function Page(pagePath, pageName, extName){
    // let fileURI = pagePath +'pages' + pageName + '/' + '.' + extName;  
    let fileURI = `${pagePath}pages/${pageName}/${pageName}.${extName}`
    // let content = grunt.file.read(fileURI);        
    let pageModulesTopology = new Map();
    let pageModuleChain = [];
    let rootNode = new ChainNode();
    
    function getModuleCallChain(){
        let moduleList = getModules(fileURI);
        
        parseModulesTopology(moduleList);
        parseModuleCallChain(pageModulesTopology);
        return pageModuleChain;
    }


   
    function parseModuleCallChain(topology){
        for (let [key, element] of topology.entries()) {
            if (element.count === 0) {
                let path = key.replace(/\./g, '/');
                let fileURI = pagePath + path + '.' + extName;  
                pageModuleChain.unshift(fileURI);
                subtracter(element);
                topology.delete(key);
            }
        }
        if(topology.size > 0){
            parseModuleCallChain(topology)
        }
    }

    function subtracter(element) {
        let length = element.nextNodes.length;
        for(let index=0; index < length; index++) {
            let moduleKey = element.nextNodes[index];
            let item = pageModulesTopology.get(moduleKey);
            item.count--;
            // pageModulesTopology.set(moduleKey, item);
        }
    }



    function parseModulesTopology(moduleList){
        if (moduleList.size > 0) {
            moduleList.forEach((key, value) => {
                if(!pageModulesTopology.has(value)){
                    pageModulesTopology.set(value, new ChainNode())    
                }
                let item = pageModulesTopology.get(value);
                item.count++;

                let moduleFileName = value.replace(/\./g, '/');
                let fileURI = pagePath + moduleFileName + '.' + extName;
                let modules = getModules(fileURI);
                item.nextNodes = modules;
                parseModulesTopology(modules);
            })
        }
    }

    function getModules(fileURI){
        let moduleStack = new Set();
        // let content = grunt.file.read(fileURI);
        let content = fs.readFileSync(fileURI, {encoding:'utf8'})
         content.replace(/require\((['"]\s*([^'"]+)\s*['"])\)/ig, function(matchStr, moduleStr, moduleName){
            moduleStack.add(moduleName);
         }); 
         return moduleStack;       
    }

    let publicAPI = {
        getModuleCallChain : getModuleCallChain
    };
    return publicAPI;

}

function ChainNode(){
    let result = {
        count : -1,
        nextNodes:[]
    };
    return result;
}

module.exports = Page;