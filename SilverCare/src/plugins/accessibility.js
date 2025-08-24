// 可访问性工具函数

export const setupAccessibility = () => {
  // 确保所有图片都有alt文本
  const images = document.querySelectorAll('img:not([alt])');
  images.forEach(img => {
    img.alt = 'Image'; // 默认alt文本
  });

  // 为所有表单元素添加标签
  const inputs = document.querySelectorAll('input:not([id])');
  inputs.forEach((input, index) => {
    const id = `input-${index}`;
    input.id = id;
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = input.placeholder || 'Input field';
    input.parentNode.insertBefore(label, input);
  });

  // 添加键盘导航支持
  document.addEventListener('keydown', (e) => {
    // 允许使用Enter键提交表单
    if (e.key === 'Enter' && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.click();
    }
  });

  // 确保文本对比度符合标准
  const checkContrast = () => {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      const color = style.color;

      // 简单对比度检查 (实际应用中应使用更复杂的算法)
      if (bgColor && color && bgColor !== color) {
        // 这里只是一个占位实现
        // 在实际应用中，应使用WCAG对比度标准进行检查
      }
    });
  };

  // 初始检查
  checkContrast();

  // 当页面加载完成后再次检查
  window.addEventListener('load', checkContrast);

  return {
    checkContrast
  };
};