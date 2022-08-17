// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150; // 横坐标确定
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.3, b: 0}}];
      // pageNode https://www.figma.com/plugin-docs/api/PageNode#appendchild
      figma.currentPage.appendChild(rect); // 添加到当前页
      nodes.push(rect);
    }
    console.log("user is ", figma.currentUser); // 注入用户信息
    figma.currentPage.selection = nodes; // 选中所有节点
    // Automatically sets the viewport coordinates such that the nodes are visible on screen. It is the equivalent of pressing Shift-1.
    figma.viewport.scrollAndZoomIntoView(nodes); // 有点居中查看 nodes 的意思 相当于 shift-1
  }

  // 最终都需要进行 close，无论是进入 create-rectangles 还是直接 cancel
  // https://www.figma.com/plugin-docs/api/properties/figma-closeplugin
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
  figma.notify("close plugin ok"); // 进行消息通知
};
