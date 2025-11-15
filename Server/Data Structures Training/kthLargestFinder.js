// implement the min heap:
class MinHeap{
    constructor(capacity){
        this.heapBuffer= new Array();
        this.capacity=capacity;
    }   
    getParentIndex(i){
        return Math.floor((i-1)/2)
    }
    getRightChildIndex(i){
        return (2*i) +2;
     }
    getLeftChildIndex(i){
        return (2*i) +1;
     }
     swap(a,b){
        var temp = this.heapBuffer[a];
        this.heapBuffer[a]= this.heapBuffer[b];
        this.heapBuffer[b] = temp;
     }
    // insert Item into the heap
    insert(item){
        console.log(`Heap before inserting ${item} `,this.heapBuffer)
        if(!this.heapBuffer.length)  {
            this.heapBuffer.push(item);
            return console.log(`Heap after inserting ${item} `,this.heapBuffer)
        }
        if(this.heapBuffer.length<this.capacity){
            this.heapBuffer.push(item);
            this.heapifyUp(this.heapBuffer.length-1)
            console.log(`Heap after inserting ${item} `,this.heapBuffer)
            return
        }
        if(item>this.heapBuffer[0]){
            // replace the TOP with item
            this.heapBuffer[0] = item; 
            this.heapifyDown(0)
            console.log(`Heap after inserting ${item} `,this.heapBuffer)
        }

    }
    heapifyDown(index){
        var current = index;
        var leftChild = this.getLeftChildIndex(current);
        var rightChild = this.getRightChildIndex(current);
        // Compare left child and the right CHILD:
        if(this.heapBuffer[leftChild] < this.heapBuffer[rightChild]){
            if(leftChild <= this.capacity && this.heapBuffer[leftChild]<this.heapBuffer[current] ){
                this.swap(leftChild,current);
                current= leftChild;
                this.heapifyDown(current)
                return 
            }
        }
        else{
            if(rightChild <= this.capacity && this.heapBuffer[rightChild]<this.heapBuffer[current] ){
                this.swap(rightChild,current)
                current= rightChild
                this.heapifyDown(current)
                return
        }
        }
    }
    heapifyUp(index){
        var current = index;
        var parentIndex = this.getParentIndex(current)
         while(current > 0 && this.heapBuffer[current] < this.heapBuffer[parentIndex]){
            this.swap(current,parentIndex)
            current = parentIndex;
            parentIndex = this.getParentIndex(parentIndex)
         }
    }
    peak(){
        return this.heapBuffer[0]
    }
    print(){
        return console.log("Heap is ",this.heapBuffer)
    }
}


class KthLargestFinder {
    constructor(k,buffer){
        this.constraint = k;
        this.stream = buffer;
        this.minHeap = new MinHeap(this.constraint);
        buffer.forEach(element => {
            this.minHeap.insert(element)
        });
    }
    // upon adding a value
    insert(item){
        this.stream.push(item);
        this.minHeap.insert(item);
    }
    find(){
        return this.minHeap.peak()
    }
    viewHeap(){
        return this.minHeap.print();
    }
    print(){
        console.log("Dtat stream is ",this.stream)
    }
}
const finder = new KthLargestFinder(3,[3,5,2,7,4,2,8]);
finder.viewHeap()


