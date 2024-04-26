## 2-3 Trees
We are here to try to solve the problem of binary search trees getting unbalanced over time.
A special kind of node is possible that 

## Question
Implement Kd-Tree

## Solution
Here's a minimal summary of the KD-tree implementation

### Nearest

- **KD-tree Structure**
  - Points are stored in a 2D space, with nodes storing:
    - A 2D point (`Point2D p`).
    - A rectangular container (`RectHV container`) defines the area represented by the node.
    - References to left/bottom (`Node lb`) and right/top (`Node rt`) subtrees.
    - A boolean indicates the orientation (`vertical`).

- **Insertion Process**
  - Nodes are inserted based on their x-coordinate if the current node's division is vertical, otherwise based on the y-coordinate.
  - Subtrees are defined recursively, splitting the space into left/bottom and right/top halves.
  - The child of a vertical tree is horizontal and vice versa, splitting the space in alternate directions.

- **Search for Nearest Point**
  - Start from the root and recursively choose the subtree (left or right) that contains the point or is closer to it based on squared distance.
  - If the node is vertical, compare x-coordinates; if horizontal, compare y-coordinates.
  - Always check both subtrees, but start with the more likely subtree (the side of the split where the point lies). 
  - Prune branches: if the closest point found so far is closer than the distance to the rectangle of the other subtree, skip searching that subtree.

### Range Search
`rectSearchHelper` function is used for the range search in the KD-tree. To recursively find all points within a specified rectangle (`rect`) in the KD-tree.

- **Range Search**:
  1. **Base Condition**: If the current node is `null`, terminate the recursion.
  2. **Point Inclusion**: Check if the point at the current node is inside the `rect`. If so, add it to the results list.
  3. **Subtree Exploration**: For each child (lb or rt), Check if the rectangle intersects with the area covered by this node's `rect`. If there's an intersection, recursively search this subtree.

