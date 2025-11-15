// creaste a simple grapg using the adjascency list....
class GraphDataStructure {
    constructor(){
        this.graph={};
        this.nodes=[];
    }
    addVertex(v){
        this.nodes.push(v)
        if(!this.graph.hasOwnProperty(v)){
            this.graph[v]=[];
        }
        else{
            console.log(`Cant add a vertex that already exists (${v} already exists)`)
        }
    }
    addEdge(v1,v2){
        if(!this.graph.hasOwnProperty(v1)){
            this.addVertex(v1)
        }
        if(!this.graph.hasOwnProperty(v2)){
            this.addVertex(v2)
        }
        this.graph[v1].push(v2);
        this.graph[v2].push(v1);
    }
    dfs(graph,visitedSet,starting_node){
        visitedSet.push(starting_node);
        // console.log(starting_node);
        graph[starting_node].forEach(neighbour => {
            if(!visitedSet.includes(neighbour)){
                this.dfs(graph,visitedSet,neighbour)
            } 
        });
    }
    dfsWrapper(starting_node){
        const visitedSet= new Array();
        this.dfs(this.graph,visitedSet,starting_node)
        return visitedSet;
    }
    findConnectedComponents(){
        if(!Object.keys(this.graph).length){
            return console.log("Graph is empty...")
        }
        this.connectedComponentsWrapper()
    }
    connectedComponentsWrapper(){
        const components= new Array();
        components.push(this.dfsWrapper(0));
        for(const key in this.graph){
            let state = false;
            components.forEach((element)=>{
                if(element.includes(parseInt(key))){
                    state= true;
                    // console.log(`${key} is part of a component`)
                }
            })
            if(!state){
               components.push( this.dfsWrapper(parseInt(key)));
            }
        }
        console.log(`Total number of available components is ${components.length} and the components are :`,components)

    }
    
}


const myGraph =  new GraphDataStructure();

myGraph.addEdge(0,1)
myGraph.addEdge(0,2)
myGraph.addEdge(2,3)
myGraph.addEdge(4,5)
myGraph.addEdge(5,6)
// myGraph.dfsWrapper(0)
myGraph.findConnectedComponents()
// console.log("The grapgh data structure is ",myGraph)





