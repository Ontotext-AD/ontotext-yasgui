export const D3_7_8_5_RENDER = (function () {

  const DEFAULTS = {
    localeStrings: {},
    d3: {
      width: () => $(window).width() / 1.4,
      height: () => $(window).height() / 1.4,
    },
  };

  const createRenderElement = () => {
    return $("<div>").css({
      width: "100%",
      height: "100%",
    })[0];
  }

  const createTree = () => {
    return {
      name: "All",
      children: [],
    };
  }

  const addToTree = (tree, path, value) => {
    if (path.length === 0) {
      tree.value = value;
      return;
    }

    if (tree.children == null) {
      tree.children = [];
    }

    const x = path.shift();
    const existingChild = tree.children.find((child) => child.name === x);

    if (existingChild) {
      addToTree(existingChild, path, value);
    } else {
      const newChild = {
        name: x,
      };
      addToTree(newChild, path, value);
      tree.children.push(newChild);
    }
  };

  const treemapFunction = (pivotData, opts) => {
    const tree = createTree();
    const rowKeys = pivotData.getRowKeys();
    rowKeys.forEach((rowKey) => {
      const value = pivotData.getAggregator(rowKey, []).value();
      if (value != null) {
        addToTree(tree, rowKey, value);
      }
    });

    opts = $.extend(true, {}, DEFAULTS, opts);
    const treemap = d3.treemap().size([opts.d3.width(), opts.d3.height()]).padding([15, 0, 0, 0]).round(true);
    const root = d3.hierarchy(tree).sum((d) => d.value);
    const nodes = treemap(root).descendants();
    const renderElement = createRenderElement();

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    d3.select(renderElement)
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("div")
      .attr("class", "node")
      .style("background", (d) => d.children ? "lightgrey" : color(d.data.name))
      .text((d) => d.data.name)
      .call((n) => {
      n.style("left", (d) => `${d.x0}px`)
        .style("top", (d) => `${d.y0}px`)
        .style("width", (d) => `${Math.max(0, d.x1 - d.x0 - 1)}px`)
        .style("height", (d) => `${Math.max(0, d.y1 - d.y0 - 1)}px`);
    });

    return renderElement;
  };

  const register = (renderName = 'Treemap') => {
    const render = {};
    render[renderName] = treemapFunction;
    return $.pivotUtilities.d3_7_8_3_renderers = render;
  };

  return {
    register,
  };
})();
