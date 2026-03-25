// 颜色主题选择器 - 类似 CTF-WIKI
(function() {
  // 主题色配置
  const primaryColors = [
    { name: 'red', class: 'red' },
    { name: 'pink', class: 'pink' },
    { name: 'purple', class: 'purple' },
    { name: 'deep-purple', class: 'deep-purple' },
    { name: 'indigo', class: 'indigo' },
    { name: 'blue', class: 'blue' },
    { name: 'light-blue', class: 'light-blue' },
    { name: 'cyan', class: 'cyan' },
    { name: 'teal', class: 'teal' },
    { name: 'green', class: 'green' },
    { name: 'light-green', class: 'light-green' },
    { name: 'lime', class: 'lime' },
    { name: 'yellow', class: 'yellow' },
    { name: 'amber', class: 'amber' },
    { name: 'orange', class: 'orange' },
    { name: 'deep-orange', class: 'deep-orange' },
    { name: 'brown', class: 'brown' },
    { name: 'grey', class: 'grey' },
    { name: 'blue-grey', class: 'blue-grey' },
    { name: 'white', class: 'white' },
    { name: 'black', class: 'black' }
  ];

  const accentColors = [
    { name: 'red', class: 'red' },
    { name: 'pink', class: 'pink' },
    { name: 'purple', class: 'purple' },
    { name: 'deep-purple', class: 'deep-purple' },
    { name: 'indigo', class: 'indigo' },
    { name: 'blue', class: 'blue' },
    { name: 'light-blue', class: 'light-blue' },
    { name: 'cyan', class: 'cyan' },
    { name: 'teal', class: 'teal' },
    { name: 'green', class: 'green' },
    { name: 'light-green', class: 'light-green' },
    { name: 'lime', class: 'lime' },
    { name: 'yellow', class: 'yellow' },
    { name: 'amber', class: 'amber' },
    { name: 'orange', class: 'orange' },
    { name: 'deep-orange', class: 'deep-orange' },
    { name: 'white', class: 'white' },
    { name: 'black', class: 'black' }
  ];

  // 创建颜色选择器 HTML
  function createThemePicker() {
    const pickerHTML = `
      <div class="theme-picker-container">
        <div class="theme-picker-section">
          <span class="theme-picker-label">配色方案</span>
          <div class="theme-picker-buttons">
            <button class="theme-picker-btn" data-scheme="default" title="亮色模式">
              <span class="scheme-light"></span>
              <span>亮色</span>
            </button>
            <button class="theme-picker-btn" data-scheme="slate" title="深色模式">
              <span class="scheme-dark"></span>
              <span>深色</span>
            </button>
          </div>
        </div>
        <div class="theme-picker-section">
          <span class="theme-picker-label">主色调</span>
          <div class="theme-color-grid" id="primary-colors">
            ${primaryColors.map(color => `
              <button class="theme-color-btn" data-primary="${color.class}" 
                      style="background-color: var(--md-color-${color.class})"
                      title="${color.name}">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="theme-picker-section">
          <span class="theme-picker-label">强调色</span>
          <div class="theme-color-grid" id="accent-colors">
            ${accentColors.map(color => `
              <button class="theme-color-btn" data-accent="${color.class}"
                      style="background-color: var(--md-color-${color.class})"
                      title="${color.name}">
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    return pickerHTML;
  }

  // 初始化主题选择器
  function initThemePicker() {
    // 创建触发按钮
    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'theme-picker-trigger';
    triggerBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
        <circle cx="12" cy="12" r="5"/>
      </svg>
    `;
    triggerBtn.title = '选择主题颜色';

    // 创建弹出容器
    const pickerContainer = document.createElement('div');
    pickerContainer.className = 'theme-picker-popup';
    pickerContainer.innerHTML = createThemePicker();

    // 添加到导航栏右侧（搜索框前面）
    const header = document.querySelector('.md-header__inner');
    const searchBox = header?.querySelector('.md-search');
    
    if (searchBox) {
      header.insertBefore(triggerBtn, searchBox);
      header.appendChild(pickerContainer);
    } else if (header) {
      header.appendChild(triggerBtn);
      header.appendChild(pickerContainer);
    }

    // 绑定事件
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pickerContainer.classList.toggle('active');
      triggerBtn.classList.toggle('active');
    });

    // 点击外部关闭
    document.addEventListener('click', () => {
      pickerContainer.classList.remove('active');
      triggerBtn.classList.remove('active');
    });

    pickerContainer.addEventListener('click', (e) => e.stopPropagation());

    // 绑定配色方案切换
    pickerContainer.querySelectorAll('[data-scheme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const scheme = btn.dataset.scheme;
        setScheme(scheme);
      });
    });

    // 绑定主色调切换
    pickerContainer.querySelectorAll('[data-primary]').forEach(btn => {
      btn.addEventListener('click', () => {
        const primary = btn.dataset.primary;
        setPrimaryColor(primary);
      });
    });

    // 绑定强调色切换
    pickerContainer.querySelectorAll('[data-accent]').forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = btn.dataset.accent;
        setAccentColor(accent);
      });
    });

    // 从本地存储恢复设置
    restoreSettings();
  }

  // 设置配色方案
  function setScheme(scheme) {
    const body = document.body;
    const colorScheme = scheme === 'slate' ? 'dark' : 'light';
    
    body.setAttribute('data-md-color-scheme', scheme);
    body.setAttribute('data-md-color-mode', colorScheme);
    localStorage.setItem('theme-scheme', scheme);
    
    // 更新按钮状态
    document.querySelectorAll('[data-scheme]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scheme === scheme);
    });
  }

  // 设置主色调
  function setPrimaryColor(color) {
    document.body.setAttribute('data-md-color-primary', color);
    localStorage.setItem('theme-primary', color);
    
    // 更新按钮状态
    document.querySelectorAll('[data-primary]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.primary === color);
    });
  }

  // 设置强调色
  function setAccentColor(color) {
    document.body.setAttribute('data-md-color-accent', color);
    localStorage.setItem('theme-accent', color);
    
    // 更新按钮状态
    document.querySelectorAll('[data-accent]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.accent === color);
    });
  }

  // 恢复本地存储的设置
  function restoreSettings() {
    const scheme = localStorage.getItem('theme-scheme') || 'default';
    const primary = localStorage.getItem('theme-primary') || 'white';
    const accent = localStorage.getItem('theme-accent') || 'red';

    setScheme(scheme);
    setPrimaryColor(primary);
    setAccentColor(accent);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemePicker);
  } else {
    initThemePicker();
  }
})();
