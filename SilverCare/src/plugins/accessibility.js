// 可访问性工具函数

// 计算相对亮度
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// 计算对比度比率
function getContrastRatio(lum1, lum2) {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// 解析颜色值
function parseColor(color) {
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  } else if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }
  return [0, 0, 0]; // 默认黑色
}

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
    
    // 支持Space键激活按钮
    if (e.key === ' ' && document.activeElement.tagName === 'BUTTON') {
      e.preventDefault(); // 防止空格键滚动页面
      document.activeElement.click();
    }
  });

  // 确保文本对比度符合WCAG 2.1 AA级标准 (4.5:1)
  const checkContrast = () => {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      const color = style.color;
      const fontSize = parseFloat(style.fontSize);
      
      // 解析背景色和文字颜色
      const bgRGB = parseColor(bgColor);
      const textRGB = parseColor(color);
      
      // 计算相对亮度
      const bgLuminance = getLuminance(bgRGB[0], bgRGB[1], bgRGB[2]);
      const textLuminance = getLuminance(textRGB[0], textRGB[1], textRGB[2]);
      
      // 计算对比度比率
      const contrastRatio = getContrastRatio(bgLuminance, textLuminance);
      
      // 检查是否符合WCAG 2.1 AA级标准
      // 对于正文文本(小于18pt或14pt粗体)，需要4.5:1的对比度
      // 对于大文本(大于等于18pt或14pt粗体)，需要3:1的对比度
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight >= 700);
      const requiredRatio = isLargeText ? 3 : 4.5;
      
      if (contrastRatio < requiredRatio) {
        console.warn(`Element ${element.tagName} has insufficient contrast ratio: ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`);
        // 可以在这里添加视觉提示，例如添加边框或背景
        // element.style.border = '2px solid red';
      }
    });
  };

  // 初始检查
  checkContrast();

  // 当页面加载完成后再次检查
  window.addEventListener('load', checkContrast);

  // 添加焦点指示器样式
  const addFocusStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* 为所有可聚焦元素添加清晰的焦点指示器 */
      a:focus, button:focus, input:focus, select:focus, textarea:focus {
        outline: 2px solid #1ab3a6 !important;
        outline-offset: 2px !important;
      }
      
      /* 确保焦点指示器在所有背景下都可见 */
      :focus-visible {
        outline: 2px solid #1ab3a6 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  };
  
  addFocusStyles();

  // 添加按钮点击提示功能
  const addButtonClickFeedback = () => {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        // 创建临时提示元素
        const feedback = document.createElement('div');
        feedback.textContent = 'Button clicked';
        feedback.style.position = 'fixed';
        feedback.style.top = '20px';
        feedback.style.right = '20px';
        feedback.style.backgroundColor = '#1ab3a6';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '9999';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.3s';
        
        document.body.appendChild(feedback);
        
        // 显示提示
        setTimeout(() => {
          feedback.style.opacity = '1';
        }, 10);
        
        // 2秒后移除提示
        setTimeout(() => {
          feedback.style.opacity = '0';
          setTimeout(() => {
            if (feedback.parentNode) {
              feedback.parentNode.removeChild(feedback);
            }
          }, 300);
        }, 2000);
      }
    });
  };
  
  addButtonClickFeedback();

  return {
    checkContrast
  };
};