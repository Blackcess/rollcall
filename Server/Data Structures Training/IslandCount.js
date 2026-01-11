// find the number of island on a grid map....
function islandFinder (grid){
    if(!Array.isArray(grid) || !Array.isArray(grid[0])) return console.log("Invalid grid fomat")
    if(!grid && !grid.length) return 0;
    // find the number of row and columns in the grid...
    const rows = grid.length;
    const cols= grid[0].length;
    // console.log(`r: ${rows}, c: ${cols}`)
    let count = 0;
    const visitedSet = new Array();
    const dfs = (r,c)=>{
        // base cases :
        if(r==-1 || c==-1 || r>=rows || c >=cols){
            return ;
        }
        if(grid[r][c]==0){
            return // its water, we do not need water we need land
        }
        if(visitedSet.includes(`${r},${c}`)){
            return
        }
        visitedSet.push(`${r},${c}`)
        console.log("visitedSet: ",visitedSet)
        // check the neighbours:
        dfs(r,c-1)
        dfs(r,c+1)
        dfs(r-1,c)
        dfs(r+1,c)
        return 14;
    }
    // traverse the entire grid perfoming dfs on every node that is a 1 and is unvisited:
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(!visitedSet.includes(`${i},${j}` && !grid[i][j]==0)){
                let secret=dfs(i,j)
                if(secret===14){
                    count= count + 1
                    // console.log(`count triggered by (${i},${j}) to ${count}`)
                }
                
            }
        }
    }
    return count;
}


const grid = [];
grid[0]=[1,0,0]
grid[1]=[0,1,0]
grid[2]=[0,0,1]
// console.log ("grid: ",grid)
const val= islandFinder(grid)
console.log(`${val} islands found`)