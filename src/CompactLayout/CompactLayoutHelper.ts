import {TreeNode} from "../types/common";
import {cumsum as d3Cumsum, max as d3Max, sum as d3Sum} from "d3";
import {CompactLayoutConfiguration} from "./CompactLayoutConfiguration";

export const groupBy = (array: TreeNode[], accessor: (TreeNode) => any, aggegator) => {
  const grouped = {}
  array.forEach(item => {
    const key = accessor(item)
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(item)
  })

  Object.keys(grouped).forEach(key => {
    grouped[key] = aggegator(grouped[key])
  })
  return Object.entries(grouped);
}

export const calculateCompactFlexDimensions = (root: TreeNode, compactLayout: CompactLayoutConfiguration) => {
  // Initialize all node compact state
  root.eachBefore(node => {
    const compactState = node.data.__rd3t.compact;
    compactState.firstCompact = null;
    compactState.compactEven = null;
    compactState.flexCompactDim = null;
    compactState.firstCompactNode = null;
  })

  root.eachBefore(node => {
    const compactState = node.data.__rd3t.compact;

    if (node.children && node.children.length > 1) {
      const compactChildren = node.children.filter(d => !d.children);

      if (compactChildren.length < 2) return;

      compactChildren.forEach((child, i) => {
        const childCompactState = child.data.__rd3t.compact;

        if (!i) childCompactState.firstCompact = true;
        if (i % 2) childCompactState.compactEven = false;
        else childCompactState.compactEven = true;

        childCompactState.row = Math.floor(i / 2);
      })
      const evenMaxColumnDimension = d3Max<any, number>(compactChildren.filter(node => node.data.__rd3t.compact.compactEven), compactLayout.compactDimension.sizeColumn);
      const oddMaxColumnDimension = d3Max<any, number>(compactChildren.filter(node=> !node.data.__rd3t.compact.compactEven), compactLayout.compactDimension.sizeColumn);
      const columnSize = Math.max(evenMaxColumnDimension, oddMaxColumnDimension) * 2;

      const rowsMapNew = groupBy(compactChildren,
        node => node.data.__rd3t.compact.row,
        (reducedGroup: Iterable<TreeNode>) => d3Max(reducedGroup, (node: TreeNode) => compactLayout.compactDimension.sizeRow(node) + compactLayout.compactMarginBetween()));

      const rowSize = d3Sum(rowsMapNew.map(v => v[1]) as unknown as number[])
      compactChildren.forEach(node => {
        const compactState = node.data.__rd3t.compact;
        compactState.firstCompactNode = compactChildren[0];
        if (compactState.firstCompact) {
          compactState.flexCompactDim = [
            columnSize + compactLayout.compactMarginPair(node),
            rowSize - compactLayout.compactMarginBetween()
          ];
        } else {
          compactState.flexCompactDim = [0, 0];
        }
      })
      compactState.flexCompactDim = null;
    }
  })
}

export const calculateCompactFlexPositions = (root: TreeNode, compactLayout: CompactLayoutConfiguration) => {
  root.eachBefore(node => {
    if (node.children) {

      const compactChildren = node.children.filter(node => node.data.__rd3t.compact.flexCompactDim);
      const fch = compactChildren[0];

      if (!fch) return;

      const fchCompactState = fch.data.__rd3t.compact;

      compactChildren.forEach((child, i, arr) => {
        if (i == 0) {
          fch.x -= fchCompactState.flexCompactDim[0] / 2;
        }
        if (i & i % 2 - 1) {
          child.x = fch.x + fchCompactState.flexCompactDim[0] * 0.25 - compactLayout.compactMarginPair(child) / 4;
        }
        else if (i) {
          child.x = fch.x + fchCompactState.flexCompactDim[0] * 0.75 + compactLayout.compactMarginPair(child) / 4;
        }
      })
      const centerX = fch.x + fchCompactState.flexCompactDim[0] * 0.5;

      fch.x = fch.x + fchCompactState.flexCompactDim[0] * 0.25 - compactLayout.compactMarginPair(fch) / 4;
      const offsetX = node.x - centerX;
      if (Math.abs(offsetX) < 10) {
        compactChildren.forEach(d => d.x += offsetX);
      }

      const rowsMapNew = groupBy(compactChildren,
        (node: TreeNode) => node.data.__rd3t.compact.row,
        reducedGroup => d3Max(reducedGroup, (node: TreeNode) => compactLayout.compactDimension.sizeRow(node)));

      const cumSum = d3Cumsum(rowsMapNew.map(d => d[1] as number + compactLayout.compactMarginBetween()));
      compactChildren
        .forEach((node, i) => {
          const compactState = node.data.__rd3t.compact;
          if (compactState.row) {
            node.y = fch.y + cumSum[compactState.row - 1]
          } else {
            node.y = fch.y;
          }
        })
    }
  })
}
