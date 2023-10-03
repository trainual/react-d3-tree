"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCompactFlexPositions = exports.calculateCompactFlexDimensions = exports.groupBy = void 0;
var d3_1 = require("d3");
exports.groupBy = function (array, accessor, aggegator) {
    var grouped = {};
    array.forEach(function (item) {
        var key = accessor(item);
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });
    Object.keys(grouped).forEach(function (key) {
        grouped[key] = aggegator(grouped[key]);
    });
    return Object.entries(grouped);
};
exports.calculateCompactFlexDimensions = function (root, compactLayout) {
    // Initialize all node compact state
    root.eachBefore(function (node) {
        var compactState = node.data.__rd3t.compact;
        compactState.firstCompact = null;
        compactState.compactEven = null;
        compactState.flexCompactDim = null;
        compactState.firstCompactNode = null;
    });
    root.eachBefore(function (node) {
        var compactState = node.data.__rd3t.compact;
        if (node.children && node.children.length > 1) {
            var compactChildren_1 = node.children.filter(function (d) { return !d.children; });
            if (compactChildren_1.length < 2)
                return;
            compactChildren_1.forEach(function (child, i) {
                var childCompactState = child.data.__rd3t.compact;
                if (!i)
                    childCompactState.firstCompact = true;
                if (i % 2)
                    childCompactState.compactEven = false;
                else
                    childCompactState.compactEven = true;
                childCompactState.row = Math.floor(i / 2);
            });
            var evenMaxColumnDimension = d3_1.max(compactChildren_1.filter(function (node) { return node.data.__rd3t.compact.compactEven; }), compactLayout.compactDimension.sizeColumn);
            var oddMaxColumnDimension = d3_1.max(compactChildren_1.filter(function (node) { return !node.data.__rd3t.compact.compactEven; }), compactLayout.compactDimension.sizeColumn);
            var columnSize_1 = Math.max(evenMaxColumnDimension, oddMaxColumnDimension) * 2;
            var rowsMapNew = exports.groupBy(compactChildren_1, function (node) { return node.data.__rd3t.compact.row; }, function (reducedGroup) { return d3_1.max(reducedGroup, function (node) { return compactLayout.compactDimension.sizeRow(node) + compactLayout.compactMarginBetween(); }); });
            var rowSize_1 = d3_1.sum(rowsMapNew.map(function (v) { return v[1]; }));
            compactChildren_1.forEach(function (node) {
                var compactState = node.data.__rd3t.compact;
                compactState.firstCompactNode = compactChildren_1[0];
                if (compactState.firstCompact) {
                    compactState.flexCompactDim = [
                        columnSize_1 + compactLayout.compactMarginPair(node),
                        rowSize_1 - compactLayout.compactMarginBetween()
                    ];
                }
                else {
                    compactState.flexCompactDim = [0, 0];
                }
            });
            compactState.flexCompactDim = null;
        }
    });
};
exports.calculateCompactFlexPositions = function (root, compactLayout) {
    root.eachBefore(function (node) {
        if (node.children) {
            var compactChildren = node.children.filter(function (node) { return node.data.__rd3t.compact.flexCompactDim; });
            var fch_1 = compactChildren[0];
            if (!fch_1)
                return;
            var fchCompactState_1 = fch_1.data.__rd3t.compact;
            compactChildren.forEach(function (child, i, arr) {
                if (i == 0) {
                    fch_1.x -= fchCompactState_1.flexCompactDim[0] / 2;
                }
                if (i & i % 2 - 1) {
                    child.x = fch_1.x + fchCompactState_1.flexCompactDim[0] * 0.25 - compactLayout.compactMarginPair(child) / 4;
                }
                else if (i) {
                    child.x = fch_1.x + fchCompactState_1.flexCompactDim[0] * 0.75 + compactLayout.compactMarginPair(child) / 4;
                }
            });
            var centerX = fch_1.x + fchCompactState_1.flexCompactDim[0] * 0.5;
            fch_1.x = fch_1.x + fchCompactState_1.flexCompactDim[0] * 0.25 - compactLayout.compactMarginPair(fch_1) / 4;
            var offsetX_1 = node.x - centerX;
            if (Math.abs(offsetX_1) < 10) {
                compactChildren.forEach(function (d) { return d.x += offsetX_1; });
            }
            var rowsMapNew = exports.groupBy(compactChildren, function (node) { return node.data.__rd3t.compact.row; }, function (reducedGroup) { return d3_1.max(reducedGroup, function (node) { return compactLayout.compactDimension.sizeRow(node); }); });
            var cumSum_1 = d3_1.cumsum(rowsMapNew.map(function (d) { return d[1] + compactLayout.compactMarginBetween(); }));
            compactChildren
                .forEach(function (node, i) {
                var compactState = node.data.__rd3t.compact;
                if (compactState.row) {
                    node.y = fch_1.y + cumSum_1[compactState.row - 1];
                }
                else {
                    node.y = fch_1.y;
                }
            });
        }
    });
};
