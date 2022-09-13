"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalDefaultLayout = exports.VerticalDefaultLayout = void 0;
exports.VerticalDefaultLayout = {
    linkCompactXStart: function (node) { return node.x + (node.data.__rd3t.compact.compactEven ? node.width / 2 : -node.width / 2); },
    linkCompactYStart: function (node) { return node.y + node.height / 2; },
    compactLinkMidX: function (node) {
        var compactState = node.data.__rd3t.compact;
        return compactState.firstCompactNode.x + compactState.firstCompactNode.data.__rd3t.compact.flexCompactDim[0] / 4 + this.compactMarginPair(node) / 4;
    },
    compactLinkMidY: function (node) { return node.data.__rd3t.compact.firstCompactNode.y; },
    compactDimension: {
        sizeColumn: function (node) { return node.width; },
        sizeRow: function (node) { return node.height; },
    },
    linkX: function (node) { return node.x; },
    linkY: function (node) { return node.y; },
    linkParentX: function (node) { return node.x; },
    linkParentY: function (node) { return node.y + node.height; },
    nodeFlexSize: function (_a) {
        var height = _a.height, width = _a.width, compact = _a.compact, node = _a.node;
        var compactState = node.data.__rd3t.compact;
        if (compact && compactState.flexCompactDim) {
            return [compactState.flexCompactDim[0], compactState.flexCompactDim[1]];
        }
        ;
        return [width + this.siblingsMargin(node), height + this.childrenMargin(node)];
    },
    compactMarginPair: function (node) { return 100; },
    compactMarginBetween: function () { return 20; },
    siblingsMargin: function (node) { return 50; },
    childrenMargin: function (node) { return 50; },
};
exports.HorizontalDefaultLayout = {
    linkX: function (node) { return node.x; },
    linkY: function (node) { return node.y; },
    linkCompactXStart: function (node) { return node.x + node.width / 2; },
    linkCompactYStart: function (node) { return node.y + (node.data.__rd3t.compact.compactEven ? node.height / 2 : -node.height / 2); },
    compactLinkMidX: function (node) { return node.data.__rd3t.compact.firstCompactNode.x; },
    compactLinkMidY: function (node) {
        return node.data.__rd3t.compact.firstCompactNode.y + node.data.__rd3t.compact.firstCompactNode.data.__rd3t.compact.flexCompactDim[0] / 4 + this.compactMarginPair(node) / 4;
    },
    linkParentX: function (node) { return node.x + node.width; },
    linkParentY: function (node) { return node.y; },
    compactDimension: {
        sizeColumn: function (node) { return node.height; },
        sizeRow: function (node) { return node.width; },
    },
    nodeFlexSize: function (_a) {
        var height = _a.height, width = _a.width, compact = _a.compact, node = _a.node;
        if (compact && node.data.__rd3t.compact.flexCompactDim) {
            var result = [node.data.__rd3t.compact.flexCompactDim[0], node.data.__rd3t.compact.flexCompactDim[1]];
            return result;
        }
        ;
        return [height + this.siblingsMargin(node), width + this.childrenMargin(node)];
    },
    compactMarginPair: function (node) { return 100; },
    compactMarginBetween: function () { return 20; },
    siblingsMargin: function (node) { return 50; },
    childrenMargin: function (node) { return 50; },
};
