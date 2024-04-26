### 8puzzle assignment

__Problem__: How to solve 8puzzle algorithmically.

__Answer__: Given any starting board, make a twin and start solving both problems using the same queue. Only one of them is solvable.

From a given starting point, find 4 neighbors and put them in this queue. Use a priority queue (heap) with cost = (distance from goal + number of steps).

Distance from the goal can be Manhattan distance of each tile from its solved position.

Twin is defined as a board with any two tiles swapped.

Node = `(currentBoard, lastBoard, distance, stepCount, isTwin)`

When going through 4 neighbors, skip 1 as it is same as the previous board.

There's a difference between processing before queuing. After reaching a new board, do not return if it is solved, first put that into the queue as well. After some time, when it gets popped, that's when we should return. When the pq's cost function = (total_steps + distance), it can happen that 2 solved boards are there, and the one with higher step-count is reached before (by the A* algo), than the one with lower step count. Why? Because in pq, a better solution's intermediate steps can sometimes occur later in the queue.

Cost can have custom comparator.
    - if cost (steps + distance) is equal then compare the distance (lower is better).
    -  Since the given board is more likely to be solvable, when (cost,distance) is same, we can prioritize the non-twin board.
